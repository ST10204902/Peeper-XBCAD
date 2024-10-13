import { DatabaseUtility } from "../databaseModels/databaseClasses/DatabaseUtility";
import { DataSnapshot, get } from 'firebase/database';

// Mock the firebase/database module
jest.mock('firebase/database', () => ({
  // Mock each function that is used from the module
  get: jest.fn(),
  ref: jest.fn(),
  getDatabase: jest.fn(),
}));

// Describe block for grouping related tests for the DatabaseUtility.getAllData function
describe('DatabaseUtility.getAllData', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test case to check if getAllData returns an array of data when data exists
  it('should return an array of data when data exists', async () => {
    // Mock data to be returned by the snapshot
    const mockData = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }];

    // Partial mock of DataSnapshot with exists and forEach methods
    const mockSnapshot: Partial<DataSnapshot> = {
      exists: jest.fn().mockReturnValue(true), // Mock exists method
      forEach: jest.fn((callback) => {
        // Mock forEach method to iterate over mock data
        mockData.forEach((item) => callback({ val: () => item } as any));
        return true; // Return true to indicate successful iteration
      }),
    };

    // Mock the get function to return the mock snapshot
    (get as jest.Mock).mockResolvedValue(mockSnapshot as DataSnapshot);

    // Call the getAllData function with a test path
    const result = await DatabaseUtility.getAllData('/test/path');

    // Assert that the result matches the mock data
    expect(result).toEqual(mockData);
  });

  // Test case to check if getAllData returns an empty array when data does not exist
  it('should return an empty array when there is an error fetching data', async () => {
    // Mock the get function to reject with an error
    (get as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    // Call the getAllData function with a test path
    const result = await DatabaseUtility.getAllData('/test/path');
    // Assert that the result is an empty array
    expect(result).toEqual([]);
  });
});