import { MoveIssueHandler } from './move-issue-handler';
import { Issue } from '../models/issue';
import { GitHubClient } from '../github/github-client';
import { Logger } from '../logger/logger';

jest.mock('../github/github-client');
jest.mock('../logger/logger');

describe('MoveIssueHandler', () => {
  let moveIssueHandler: MoveIssueHandler;
  let mockGitHubClient: GitHubClient;
  let mockLogger: Logger;

  beforeEach(() => {
    mockGitHubClient = new GitHubClient() as jest.Mocked<GitHubClient>;
    mockLogger = new Logger() as jest.Mocked<Logger>;
    moveIssueHandler = new MoveIssueHandler();
    moveIssueHandler['githubClient'] = mockGitHubClient;
    moveIssueHandler['logger'] = mockLogger;
  });

  it('should move issue successfully', async () => {
    const mockIssue: Issue = {
      id: '12345',
      title: 'Test Issue',
      description: 'This is a test issue.',
      currentLocation: 'old-location',
      createdAt: '2026-03-17T00:00:00Z',
      updatedAt: '2026-03-17T00:00:00Z',
    };

    mockGitHubClient.moveIssue.mockResolvedValue(true);

    await moveIssueHandler.moveIssueToNewLocation(mockIssue, 'new-location');

    expect(mockLogger.info).toHaveBeenCalledWith('Moving issue with ID 12345 to new-location');
    expect(mockLogger.info).toHaveBeenCalledWith('Issue 12345 successfully moved to new-location');
  });

  it('should handle errors when moving issue', async () => {
    const mockIssue: Issue = {
      id: '12345',
      title: 'Test Issue',
      description: 'This is a test issue.',
      currentLocation: 'old-location',
      createdAt: '2026-03-17T00:00:00Z',
      updatedAt: '2026-03-17T00:00:00Z',
    };

    mockGitHubClient.moveIssue.mockRejectedValue(new Error('GitHub API error'));

    await expect(moveIssueHandler.moveIssueToNewLocation(mockIssue, 'new-location')).rejects.toThrow('GitHub API error');
    expect(mockLogger.error).toHaveBeenCalledWith('Error moving issue 12345: GitHub API error');
  });
});