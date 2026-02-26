// Simple data factory for Employee-like objects (compatible with the Django model)
// Usage: import { randomEmployee } from './utils/dataFactory';
// const emp = randomEmployee({ full_name: 'Nguyen Van A' });

export interface EmployeeData {
	id?: number;
	full_name: string;
	date_of_birth: string; // YYYY-MM-DD
	phone_number: string;
	email: string;
	citizen_id: string;
	gender: "0" | "1"; // false = Nam (male), true = Nu (female)
	address: string;
	image: string; // path to image
	created_at: string; // ISO datetime
	updated_at: string; // ISO datetime
}

const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Phan', 'Đặng', 'Bùi', 'Đỗ'];
const MIDDLE_NAMES = ['Văn', 'Thị', 'Minh', 'Ngọc', 'Hữu', 'Thanh', 'Thu', 'Đức', 'Quang', 'Thành'];
const LAST_NAMES = ['An', 'Bình', 'Cường', 'Dũng', 'Hải', 'Huy', 'Khanh', 'Long', 'Nam', 'Phúc'];
const STREETS = ['Lý Thường Kiệt', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Hoàng Sa', 'Trần Phú', 'Phan Đình Phùng'];

function randomFrom<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pad(n: number, width = 2) {
	return String(n).padStart(width, '0');
}

function formatDateYMD(d: Date) {
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function randomDateBetween(start: Date, end: Date) {
	const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
	return new Date(t);
}

function randomPhoneNumber() {
	// Vietnamese mobile prefixes
	const prefixes = ['03', '05', '07', '08', '09', '02'];
	const prefix = randomFrom(prefixes);
	let rest = '';
	for (let i = 0; i < 8; i++) rest += Math.floor(Math.random() * 10);
	return `${prefix}${rest}`;
}

function randomCitizenId() {
	// 9-12 digit numeric string
	const len = 9 + Math.floor(Math.random() * 4);
	let s = '';
	for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
	return s;
}

function slugifyForEmail(name: string) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '.')
		.replace(/(^\.|\.$)+/g, '')
		.slice(0, 40);
}

let _idCounter = 1000;

export function randomEmployee(overrides: Partial<EmployeeData> = {}): EmployeeData {
	const first = randomFrom(FIRST_NAMES);
	const middle = randomFrom(MIDDLE_NAMES);
	const last = randomFrom(LAST_NAMES);
	const full_name = overrides.full_name ?? `${first} ${middle} ${last}`;

	// age between 18 and 65
	const now = new Date();
	const min = new Date(now.getFullYear() - 65, 0, 1);
	const max = new Date(now.getFullYear() - 18, 11, 31);
	const date_of_birth = overrides.date_of_birth ?? formatDateYMD(randomDateBetween(min, max));

	const phone_number = overrides.phone_number ?? randomPhoneNumber();
	const citizen_id = overrides.citizen_id ?? randomCitizenId();
	const email = overrides.email ?? `${slugifyForEmail(full_name)}.${Math.floor(Math.random() * 10000)}@example.test`;

	const gender = overrides.gender ?? (Math.random() < 0.5 ? "0" : "1"); // false=Nam, true=Nu

	const address = overrides.address ?? `${Math.floor(1 + Math.random() * 200)} ${randomFrom(STREETS)}, ${randomFrom(['Hà Nội','TP HCM','Đà Nẵng','Hải Phòng','Cần Thơ'])}`;

	const created_at = overrides.created_at ?? new Date().toISOString();
	const updated_at = overrides.updated_at ?? new Date().toISOString();

	const image = overrides.image ?? 'employee_images/default.png';

	const id = overrides.id ?? ++_idCounter;

	return {
		id,
		full_name,
		date_of_birth,
		phone_number,
		email,
		citizen_id,
		gender,
		address,
		image,
		created_at,
		updated_at,
	};
}

export function randomEmployees(n = 5, overrides: Partial<EmployeeData> = {}) {
	const arr: EmployeeData[] = [];
	for (let i = 0; i < n; i++) arr.push(randomEmployee(overrides));
	return arr;
}
export function randomPassword(length = 12): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const number = '0123456789';
  const special = '!@#$%^&*';

  const all = lower + upper + number + special;

  let password = '';

  // đảm bảo có đủ các loại ký tự
  password += randomChar(lower);
  password += randomChar(upper);
  password += randomChar(number);
  password += randomChar(special);

  // random phần còn lại
  for (let i = password.length; i < length; i++) {
    password += randomChar(all);
  }

  // shuffle cho không bị cố định thứ tự
  return shuffle(password);
}

function randomChar(str: string) {
  return str[Math.floor(Math.random() * str.length)];
}

function shuffle(str: string) {
  return str
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

