// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { promises as fs } from 'fs';

const EXCEL_FILE = path.join(process.cwd(), 'data/users.xlsx');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Set in .env

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
    
    const { name, email, password, role } = await req.json();
    
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.getWorksheet('Users');

    if (!sheet) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Check if email exists
    let emailExists = false;
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && row.getCell(3).value === email) {
        emailExists = true;
      }
    });

    if (emailExists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Generate ID (simple increment)
    const id = sheet.rowCount;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add row
    sheet.addRow([id, name, email, hashedPassword, role, '']);

    await workbook.xlsx.writeFile(EXCEL_FILE);

    // Generate JWT
    const token = jwt.sign({ id, email, role }, SECRET_KEY, { expiresIn: '1d' });

    const response = NextResponse.json({ success: true });
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