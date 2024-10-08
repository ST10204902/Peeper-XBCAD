import { DatabaseUtility } from "../databaseModels/databaseClasses/DatabaseUtility";
import { DataSnapshot, get } from 'firebase/database';

jest.mock('firebase/database', () => ({
  get: jest.fn(),
  ref: jest.fn(),
  getDatabase: jest.fn(),
}));

describe('DatabaseUtility.getAllData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of data when data exists', async () => {
    const mockData = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }];
    const mockSnapshot: Partial<DataSnapshot> = {
      exists: jest.fn().mockReturnValue(true),
      forEach: jest.fn((callback) => {
        mockData.forEach((item) => callback({ val: () => item } as any));
        return true; 
      }),
    };

    (get as jest.Mock).mockResolvedValue(mockSnapshot as DataSnapshot);

    const result = await DatabaseUtility.getAllData('/test/path');
    expect(result).toEqual(mockData);
  });

  it('should return an empty array when there is an error fetching data', async () => {
    (get as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    const result = await DatabaseUtility.getAllData('/test/path');
    expect(result).toEqual([]);
  });
});