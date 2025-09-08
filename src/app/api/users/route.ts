import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/utils/dataJson';

// POST /api/users - Login de usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const users = await getUsers();
    const existingUser = users.find((u) => u.email === email);

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (existingUser.password !== password) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return NextResponse.json(existingUser);
  } catch (error) {
    console.error('Error en POST /api/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}