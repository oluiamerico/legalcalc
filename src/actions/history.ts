'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCalculations() {
  try {
    const calculations = await prisma.calculation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return calculations;
  } catch (error) {
    console.error('Failed to fetch calculations:', error);
    return [];
  }
}

export async function deleteCalculation(id: string) {
  try {
    await prisma.calculation.delete({
      where: { id },
    });
    revalidatePath('/historico');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete calculation:', error);
    return { success: false, error: 'Failed to delete calculation' };
  }
}
