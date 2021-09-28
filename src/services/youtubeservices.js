const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { flatten } = require("safe-flat");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-quick-search"));
PouchDB.plugin(require("pouchdb-find"));
const db = new PouchDB("ytDb");

module.exports = {
  download: async (url, id) => {
    try {
      const videoID = url.toString().split("=");
      let info = await ytdl.getInfo(videoID[1]);
      let audioFormats = ytdl.filterFormats(info.formats, "audioonly");

      const videoname = videoID[1].trim();
      const folder = "./data/" + id;
      const m4a = `./data/${id}/${videoname}.m4a`;
      const url1 = `http://yt-downloader.deploy.cbs.co.id/${id}/${videoname}.m4a`;

      // make directory for downloaded assets
      const directory = await fs.mkdir(
        folder,
        { recursive: true },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      let vdetails = info.player_response.videoDetails;
      const metadata = {
        title: vdetails.title,
        keywords: vdetails.keywords,
        shortDescription: vdetails.shortDescription,
      };

      // save m4a file to folder
      const download = await ytdl(url).pipe(fs.createWriteStream(m4a));
      const DOMAIN = process.env.domain;
      const data = {
        videoId: videoID[1],
        userid: id,
        url: url,
        m4a: url1,
        metadata: metadata,
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  dbdata: async (id) => {
    return db.search({
      query: id,
      fields: ["userid"],
      include_docs: true,
    });
  },

  savedata: async (data) => {
    let response;

    const doc = await db
      .bulkDocs(data)
      .then(function (result) {
        // handle result
        response = result;
      })
      .catch(function (err) {
        console.log(err);
      });

    const clean = await db
      .viewCleanup()
      .then(function (result) {
        // handle result
      })
      .catch(function (err) {
        console.log(err);
      });
    return response;
  },

  getall: async (id, data) => {
    return await db.allDocs(function (err, doc) {
      if (err) {
        console.log(err);
      }
    });
  },

  search: async (keyword, limit, skip) => {
    return db.search({
      query: keyword,
      fields: [
        "_id",
        "userid",
        "metadata.player_response.videoDetails.title",
        "metadata.player_response.videoDetails.keywords",
        "metadata.player_response.videoDetails.shortsDescription",
      ],
      include_docs: true,
      limit: limit,
      skip: skip,
    });
  },

  flatten: async (data) => {
    try {
      return await flatten(data, "_");
    } catch (err) {
      console.log(err);
    }
  },
};
