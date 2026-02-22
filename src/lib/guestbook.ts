import { supabase, type GuestbookRow } from './supabase';
import type { GuestbookEntry, GuestbookFormData } from '@/types';

// Simple hash function for password (not cryptographically secure, but sufficient for guestbook)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function fetchGuestbookEntries(): Promise<GuestbookEntry[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('guestbook')
    .select('id, name, message, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guestbook entries:', error);
    return [];
  }

  return (data as GuestbookRow[]).map(row => ({
    id: row.id.toString(),
    name: row.name,
    message: row.message,
    createdAt: new Date(row.created_at),
  }));
}

export async function createGuestbookEntry(formData: GuestbookFormData): Promise<GuestbookEntry | null> {
  if (!supabase) {
    // Return mock entry when Supabase is not configured
    return {
      id: Date.now().toString(),
      name: formData.name,
      message: formData.message,
      createdAt: new Date(),
    };
  }

  const passwordHash = await hashPassword(formData.password);

  const { data, error } = await supabase
    .from('guestbook')
    .insert({
      name: formData.name,
      password_hash: passwordHash,
      message: formData.message,
    })
    .select('id, name, message, created_at')
    .single();

  if (error) {
    console.error('Error creating guestbook entry:', error);
    return null;
  }

  return {
    id: data.id.toString(),
    name: data.name,
    message: data.message,
    createdAt: new Date(data.created_at),
  };
}

export async function deleteGuestbookEntry(id: string, password: string): Promise<boolean> {
  if (!supabase) {
    return true;
  }

  const passwordHash = await hashPassword(password);

  const { error } = await supabase
    .from('guestbook')
    .delete()
    .eq('id', parseInt(id))
    .eq('password_hash', passwordHash);

  if (error) {
    console.error('Error deleting guestbook entry:', error);
    return false;
  }

  return true;
}
