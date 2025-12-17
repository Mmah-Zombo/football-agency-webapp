// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import path from 'path';
import { promises as fs } from 'fs';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

const EXCEL_FILE = path.join(process.cwd(), 'data/users.xlsx');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

async function ensureExcelFile() {
  const dir = path.dirname(EXCEL_FILE);
  await fs.mkdir(dir, { recursive: true });

  let fileExists = false;
  try {
    const stats = await fs.stat(EXCEL_FILE);
    fileExists = stats.size > 0;
  } catch {
    fileExists = false;
  }

  if (!fileExists) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');
    sheet.addRow(['id', 'name', 'email', 'password', 'role', 'avatar']);
    await workbook.xlsx.writeFile(EXCEL_FILE);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureExcelFile();
    
    const { email, password, role } = await req.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.getWorksheet('Users');

    if (!sheet) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let user: User | null = null;
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      if (row.getCell(3).value === email && row.getCell(5).value === role) {
        user = {
          id: Number(row.getCell(1).value) || 0,
          name: String(row.getCell(2).value ?? ''),
          email: String(row.getCell(3).value ?? ''),
          password: String(row.getCell(4).value ?? ''),
          role: String(row.getCell(5).value ?? ''),
          avatar: row.getCell(6).value ? String(row.getCell(6).value) : undefined,
        };
        break;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}