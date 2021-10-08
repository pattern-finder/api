import { hash, genSalt, compare } from 'bcrypt';

export async function encrypt(value: string): Promise<string> {
  return await hash(value, await genSalt());
}

export async function crypt_compare(
  clear_value: string,
  encrypted_value: string,
): Promise<boolean> {
  return compare(clear_value, encrypted_value);
}
