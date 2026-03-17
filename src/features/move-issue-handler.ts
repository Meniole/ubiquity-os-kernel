import { Issue } from '../models/issue';
import { GitHubClient } from '../github/github-client';
import { Logger } from '../logger/logger';

class MoveIssueHandler {
  private githubClient: GitHubClient;
  private logger: Logger;

  constructor() {
    this.githubClient = new GitHubClient();
    this.logger = new Logger();
  }

  public async moveIssueToNewLocation(issue: Issue, newLocation: string): Promise<void> {
    try {
      this.logger.info(`Moving issue with ID ${issue.id} to ${newLocation}`);

      const movedIssue = await this.githubClient.moveIssue(issue, newLocation);

      if (movedIssue) {
        this.logger.info(`Issue ${issue.id} successfully moved to ${newLocation}`);
      } else {
        throw new Error(`Failed to move issue ${issue.id}`);
      }
    } catch (error) {
      this.logger.error(`Error moving issue ${issue.id}: ${error.message}`);
      throw error;
    }
  }
}

export { MoveIssueHandler };