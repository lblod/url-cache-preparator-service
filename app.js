import { app, errorHandler } from 'mu';
import { CronJob } from 'cron';
import { fetchLinksToBeCached, createDownloadTask } from './queries';

const CRON_FREQUENCY = process.env.CRON_PATTERN || '0 */15 * * * *';

app.use(errorHandler);

new CronJob(CRON_FREQUENCY, async function() {
  console.log(`Url-cache-preparator-service triggered by cron job at ${new Date().toISOString()}`);
  await processUncachedLinks();
}, null, true);

async function processUncachedLinks() {
  const fileAddresses = await fetchLinksToBeCached();

  Promise.all(fileAddresses.map(async (fileAddress) => {
    await createDownloadTask(fileAddress);
  }));
}
