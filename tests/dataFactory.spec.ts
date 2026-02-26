import { test, expect } from '@playwright/test';
import { randomEmployee, randomEmployees } from '../utils/dataFactory';

test('randomEmployee returns a valid shaped object', async () => {
  const emp = randomEmployee();
  expect(emp.full_name).toBeTruthy();
  expect(emp.email).toContain('@');
  expect(emp.phone_number).toMatch(/^\d{10,11}$/);
  expect(emp.date_of_birth).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(emp.citizen_id).toMatch(/^\d{9,12}$/);
  expect(typeof emp.gender).toBe('boolean');
});

test('randomEmployees returns requested number of employees', async () => {
  const arr = randomEmployees(3);
  expect(arr).toHaveLength(3);
   expect(new Set(arr.map(a => a.email)).size).toBe(3);
});
