    var express = require("express");
    var router = express.Router();
    const createConnection = require('../../../db2');
    const AUTHORIZATION = require('../../../middleware/auth.middleware')
    const moment = require('moment-timezone');
    const { sql, poolPromise } = require('../../../db'); // Import the pool
    const path = require('path');
    const fs = require('fs');
       
      router.get('/data', async (req, res) => {
        try {
          const pool = await poolPromise;
          const result = await pool.request().query(`WITH HomeData AS (
              SELECT 
                  title AS title, 
                  topImageUrl AS imageUrl, 
                  message,
                  messageTitle,
                  middleImage,
                  messageYouTubeId AS youtubeId, 
                  whoWeAre, 
                  whatWeAre, 
                  whatWeCanDo, 
                  whatYouWillGet
              FROM [dbo].[Home]
            ),
            VideoData AS (
                SELECT 
                    id, 
                    createdTime, 
                    title, 
                    thumbNailUrl AS thumbNailUrl, 
                    utubeId AS utubeId,
                    link,
                    isYouTube
                FROM (
                    SELECT 
                        id, 
                        createdTime, 
                        title, 
                        thumbNailUrl, 
                        utubeId,
                        link,
                        isYouTube
                    FROM [dbo].[Video]
                    WHERE isActive = 1
                    ORDER BY createdTime DESC
                    OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
                ) AS VideoSubquery
            ),
            ArticleData AS (
                SELECT 
                    id, 
                    createdTime, 
                    title, 
                    details,
                    source,
                    hastag,
                    isOpenOutside,
                    link,
                    imageUrl
                FROM (
                    SELECT 
                        id, 
                        createdTime, 
                        title, 
                        details, 
                        source,
                        hastag,
                        isOpenOutside,
                        link,
                        imageUrl
                    FROM [dbo].[Article]
                    WHERE isActive = 1
                    ORDER BY createdTime DESC
                    OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
                ) AS ArticleSubquery
            ),
            CategoryData AS (
                SELECT 
                    id, 
                    name AS title, 
                    imageUrl AS imageUrl
                FROM [dbo].[Category]
            )

            SELECT
                (
                SELECT 
                    (SELECT * FROM HomeData FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Home,
                    (SELECT * FROM VideoData FOR JSON PATH) AS Videos,
                    (SELECT * FROM ArticleData FOR JSON PATH) AS Articles,
                    (SELECT * FROM CategoryData FOR JSON PATH) AS Categories
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS data`);

          var jsonData = JSON.parse(result.recordset[0].data);
          jsonData.Home = JSON.parse(jsonData.Home)
          return res.send(ResponseObj.success('data',jsonData))

        } catch (err) {
            return res.send(ResponseObj.fail('An error occurred'))
        }
      });


      router.get('/videos/:pageno/:limit', async (req, res) => {
          try {
              // Connect to the database
              const pool = await poolPromise;

              // Get limit and pageno from query params, with defaults
              const limit = parseInt(req.params.limit) || 10;  // Default limit is 10
              const pageno = parseInt(req.params.pageno) || 1; // Default page number is 1

              // Calculate offset
              const offset = (pageno - 1) * limit;

              // Execute the paginated query
              const result = await pool.request().query(`
                  SELECT 
                      [id],
                      [isActive],
                      [utubeId],
                      [isYouTube],
                      [thumbNailUrl],
                      [title],
                      [createdTime],
                      [priority],
                      [link]
                  FROM [dbo].[Video]
                  ORDER BY [createdTime] DESC, [priority] ASC
                  OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
              `);

              // Send the result as a JSON response
              return res.send(ResponseObj.success('data',result.recordset))

          } catch (err) {
              // Handle errors
              console.error('SQL error', err);
            return res.send(ResponseObj.fail('An error occurred'))
          }
      });

      router.get('/articles/:pageno/:limit', async (req, res) => {
          try {
              // Connect to the database
              const pool = await poolPromise;

              // Get limit and pageno from query params, with defaults
              const limit = parseInt(req.params.limit) || 10;  // Default limit is 10
              const pageno = parseInt(req.params.pageno) || 1; // Default page number is 1

              // Calculate offset
              const offset = (pageno - 1) * limit;

              // Execute the paginated query
              const result = await pool.request().query(`
                  SELECT  [id]
                      ,[isActive]
                      ,[title]
                      ,[details]
                      ,[imageUrl]
                      ,[isOpenOutside]
                      ,[link]
                      ,[hastag]
                      ,[createdTime]
                      ,[priority]
                      ,[source]
                  FROM [dbo].[Article]
                  ORDER BY [createdTime] DESC, [priority] ASC
                  OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
              `);

              // Send the result as a JSON response
              return res.send(ResponseObj.success('data',result.recordset))
          } catch (err) {
              // Handle errors
            console.error('SQL error', err);
            return res.send(ResponseObj.fail('An error occurred'))
          }
      });

    router.get('/categoryHierarchy/:catId', async (req, res) => {
      try {
        const { catId } = req.params;

        // Validate catId
        if (!catId) {
            return res.status(400).send('catId is required');
        }

        // Connect to the database
          const pool = await poolPromise;

        // Query to fetch data from hierarchy table based on catId
        const result = await pool.request().query(`
               SELECT 
                [id],
                [catId],
                [designation],
                [xId],
                [fbId],
                [linkedInId],
                [name],
                [phoneno],
                [icon],
                [profession],
                [address],
                [state]
            FROM [dbo].[hierarchy]
            WHERE [catId] = 1
            ORDER BY [designation];
            `);
        // Group results by designation
        const groupedByDesignation = result.recordset.reduce((acc, curr) => {
            const { designation } = curr;
            if (!acc[designation]) {
                acc[designation] = [];
            }
            acc[designation].push(curr);
            return acc;
        }, {});

        // Send the grouped result as a JSON response
        return res.send(ResponseObj.success('data',groupedByDesignation))

        // Send the result as a JSON response
        } catch (err) {
            console.error('SQL error', err);
            return res.send(ResponseObj.fail('An error occurred'))
        }
    });

    router.get('/article/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
            const pool = await poolPromise;
           
            
            const result = await pool.request().query(`
               SELECT [id], [isActive], [title], [details], [imageUrl], 
                                 [hastag], [createdTime], [priority], [source], 
                                 [isOpenOutside], [link]
                FROM [dbo].[Article]
                WHERE [id] = ${id};
            `);
            
            if (result.recordset.length > 0) {
                return res.send(ResponseObj.success('data',result.recordset[0]))
            } else {
                res.status(404).json({ message: 'Article not found' });
            }
        } catch (err) {
            console.error('Error querying the database:', err);
            return res.send(ResponseObj.fail('An error occurred'))
        }
    });

     router.get('/allCategories', async (req, res) => {
        
        try {
            const pool = await poolPromise;
           
            const result = await pool.request().query(`
               SELECT TOP (1000) [id], [name], [isActive], [imageUrl]
            FROM [dbo].[Category]
                ;`);
            
            if (result.recordset.length > 0) {
                return res.send(ResponseObj.success('data',result.recordset))
            } else {
                res.status(404).json({ message: 'Categories not found' });
            }
        } catch (err) {
            console.error('Error querying the database:', err);
            return res.send(ResponseObj.fail('An error occurred'))
        }
    });

    router.get('/image/:image', (req, res) => {
        const imagePath = path.join(__dirname, '../../../images', req.params.image);
        const defaultImagePath = path.join(__dirname, '../../../images', 'default.png');

        // Check if the image exists
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                // If the image does not exist, send the default image
                res.sendFile(defaultImagePath);
            } else {
                // If the image exists, send the requested image
                res.sendFile(imagePath);
            }
        });
    });

     
    module.exports = router;
