// import { describe, expect, it } from 'vitest';
// import { vimic } from './vimic.js';

// interface Credentials {
//   refresh_token: string;
//   access_token: string;
//   expiry_date: number;
// }

// interface GaxiosResponse {
//   status: number;
//   statusText: string;
// }

// interface GetTokenResponse {
//   tokens: Credentials;
//   res: GaxiosResponse | null;
// }

// class MockClient {
//   async getToken(): Promise<GetTokenResponse> {
//     return {
//       tokens: {
//         refresh_token: 'original-refresh-token',
//         access_token: 'original-access-token',
//         expiry_date: 123456
//       },
//       res: { status: 200, statusText: 'OK' }
//     };
//   }
// }

// describe('vimic - async function mocking', () => {
//   const client = new MockClient();

//   it('should wrap sync mock implementation in a Promise', async () => {
//     vimic(client, 'getToken', () => ({
//       tokens: {
//         refresh_token: 'mock-refresh-token',
//         access_token: 'mock-access-token',
//         expiry_date: 987654
//       },
//       res: null
//     }));

//     // Call the async function and verify the result
//     const result = await client.getToken();
//     expect(result).toEqual({
//       tokens: {
//         refresh_token: 'mock-refresh-token',
//         access_token: 'mock-access-token',
//         expiry_date: 987654
//       },
//       res: null
//     });
//   });

//   it('should handle async mock implementations directly', async () => {
//     vimic(client, 'getToken', async () => ({
//       tokens: {
//         refresh_token: 'async-mock-refresh-token',
//         access_token: 'async-mock-access-token',
//         expiry_date: 111111
//       },
//       res: { status: 201, statusText: 'Created' }
//     }));

//     const result = await client.getToken();
//     expect(result).toEqual({
//       tokens: {
//         refresh_token: 'async-mock-refresh-token',
//         access_token: 'async-mock-access-token',
//         expiry_date: 111111
//       },
//       res: { status: 201, statusText: 'Created' }
//     });
//   });

//   it('should default to undefined if no implementation is provided', async () => {
//     vimic(client, 'getToken'); // No mock implementation provided

//     const result = await client.getToken();
//     expect(result).toBeUndefined(); // Should return `undefined`
//   });

//   it('should fail when mocking an async function returning an object', async () => {
//     vimic(client, 'getToken', () => ({
//       tokens: {
//         refresh_token: 'mock-refresh-token',
//         access_token: 'mock-access-token',
//         expiry_date: 987654
//       },
//       res: null
//     }));

//     // Expect this to fail due to type mismatch
//     const result = await client.getToken();
//     expect(result).toEqual({
//       tokens: {
//         refresh_token: 'mock-refresh-token',
//         access_token: 'mock-access-token',
//         expiry_date: 987654
//       },
//       res: null
//     });
//   });
// });
