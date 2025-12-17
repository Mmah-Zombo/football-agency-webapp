// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

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

export async function POST(req: NextRequest) {
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
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });

  return response;
}