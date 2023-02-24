const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

const urls = ['https://www.indeed.com/jobs?q=software+developer&l=United+States', 'https://www.monster.com/jobs/search/?q=software-developer&where=United-States'];
const jobListings = [];

async function scrapeData() {
  for (let url of urls) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('div.jobsearch-SerpJobCard').each((i, element) => {
      const title = $(element).find('a').text().trim();
      const company = $(element).find('span.company').text().trim();
      const location = $(element).find('div.location').text().trim();
      const link = $(element).find('a').attr('href');

      jobListings.push({
        title,
        company,
        location,
        link,
      });
    });
  }

  // Print job listings in a table in the console
  console.table(jobListings);

  // Save job listings to an Excel sheet
  const worksheet = XLSX.utils.json_to_sheet(jobListings);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Listings');
  XLSX.writeFile(workbook, 'job_listings.xlsx');
}

// Run the scraper every 12 hours
setInterval(scrapeData, 43200000);
