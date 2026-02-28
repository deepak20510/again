import { z } from "zod";

console.log('Testing Zod import...');
console.log('z.object:', typeof z.object);
console.log('z.string:', typeof z.string);
console.log('z.string().optional():', typeof z.string().optional);
console.log('z.string().optional().max:', typeof z.string().optional().max);

const testSchema = z.object({
  test: z.string().optional().max(1000, "Test message")
});

console.log('Schema created successfully');
console.log('Schema:', testSchema);
