require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const application = require("../services/youtubeservices");

module.exports = {
  // USER LOGIN
  main: async (req, res) => {
    const { id, url, limit } = req.query;
    // chromium setup for deploy
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        "/usr/src/app/node_modules/puppeteer/.local-chromium/linux-901912/chrome-linux/chrome",
    });
    // for local test
    // const browser = await puppeteer.launch({
    //   headless: true,
    // });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url);
    await page.evaluate((_) => {
      window.scrollBy(1, window.innerHeight);
    });

    let listdata = [];
    let downloaddata = [];

    let downloaded = 0;
    let videos = await page.$$("#items #dismissible");

    // find get data from database
    try {
      console.log("main");
      // const getdata = await application.dbdata(id);
      const getdata = await application.dbdata(id);
      listdata = getdata.rows;
    } catch (err) {
      console.log("no data");
      listdata = [];
    }

    try {
      for (i = 1; i <= videos.length; i++) {
        let boolean = false;
        const videoUrl = await page.$$eval(
          `#items ytd-grid-video-renderer:nth-child(${i}) #dismissible #details #meta #video-title`,
          (nodes) => nodes.map((n) => n.href)
        );
        if (listdata.length > 1) {
          console.log("checking");
          for (j = 0; j < listdata.length; j++) {
            if (listdata[j].doc.url == videoUrl) {
              console.log(j, listdata[j].doc.url);
              boolean = true;
            }
          }
        }
        // console.log(i);
        // download video and get data
        if (boolean == false) {
          const downloadFile = await application.download(
            videoUrl.toString(),
            id
          );
          downloaded += 1;

          await downloaddata.push(downloadFile);
          console.log("Downloaded files from : " + videoUrl.toString());
          console.log("files downloaded " + downloaded);
        }
        // auto save downloaded file list every 10 videos
        if (i % 10 == 0) {
          const savelist = await application.savedata(downloaddata);
        }
        //checking videos qty
        for (j = 0; j < 5; j++) {
          if (i == videos.length - 1) {
            console.log("checking length");
            page.evaluate((_) => {
              window.scrollBy(0, window.innerHeight);
            });
            await page.waitForTimeout(5000);
            videos = await page.$$("#items #dismissible");
          }
        }
        // Boolean(download == limit);
        if (downloaded >= limit) {
          const savelist = await application.savedata(downloaddata);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
    res.status(201).send({ message: `Downloaded files: ${downloaded}` });
  },

  data: async (req, res) => {
    try {
      const getdata = await application.getall();
      if (getdata == undefined) {
        res.status(401).send({ message: "data with that id is not found" });
      } else {
        res.status(201).send(getdata);
      }
    } catch (error) {
      console.log(error);
    }
  },

  search: async (req, res) => {
    const keyword = req.query.keyword;
    const limit = req.query.limit;
    const skip = req.query.skip;

    try {
      const searchdata = await application.search(keyword, limit, skip);

      res.status(201).send(searchdata);
    } catch (err) {
      console.log(err);
    }
  },
};
