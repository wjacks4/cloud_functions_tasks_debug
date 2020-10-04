// Cloud tasks stuff
const { gcloudProject, gcloudLocation, queue, firebaseProject, firebaseLocation } = require('../util/gcloudConfig')
const { projectId } = require('../util/gcloudAdmin')
const { keyFilename } = ('../util/pipeline-test.json')
const { CloudTasksClient } = require('@google-cloud/tasks')


// Sample request body
{/*
	{
		"listingID": "abc123"
		, "userID": "abc123"
		, "executionTime": "2020-10-03T19:26:49.000Z"
	}
*/}

// create cloud tasks job when listing is created
exports.manuallyCreateCloudTask = async(req, res) => {

  const cloudTaskPayload = {
    listingID: req.body.listingID
    , userID: req.body.userID
    , executionTime: req.body.executionTime
  }

  try {

      const tasksClient = new CloudTasksClient({projectId, keyFilename});
      const queuePath = await tasksClient.queuePath(gcloudProject, gcloudLocation, queue)

      const url = `https://${firebaseLocation}-${firebaseProject}.cloudfunctions.net/api/stopAuction`
      const startUrl = `https://${firebaseLocation}-${firebaseProject}.cloudfunctions.net/api/startAuction`

      const payload = JSON.stringify({
          listingID: cloudTaskPayload.listingID
          , userID: cloudTaskPayload.userID
        });

      const executionTime = ((new Date(cloudTaskPayload.executionTime).getTime())/1000)

      const taskTest = {
          httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(await payload).toString('base64'),
            headers: {
              'Content-Type': 'application/json',
            },
          },
          scheduleTime: {
            seconds: await executionTime
          }
      };

      console.log(taskTest)


      // Need to handle the case where the cloud task doesn't get created successfully...somehow need to check this before saying the auction is live.
      // Cloud tasks only supports tasks at most 720 hours (30 days) in the future
      try {
        const taskResponse = await tasksClient.createTask({ parent: queuePath, taskTest })
        const taskName = await taskResponse[0].name

        try {
          // const listingUpdateResponse = await listing.ref.update({task: taskName})
          return res.status(200).json({message: taskResponse})
          
        } catch (err) {
          console.error(err)
          return res.status(400).json({message: 'Something went wrong!'})
        }

      } catch (err) {
        console.log(err)
    return res.status(400).json({message: 'Something went wrong!'})
      }
  } catch (err) {
    console.error(err)
    return res.status(400).json({message: 'Something went wrong!'})
  }
}



exports.testEndpoint = async(req, res) => {
    const auctionExpirationPayload = {
        listingID: req.body.listingID,
        userID: req.body.userID
    }
    try {
    	console.log('SUCCESS')
    	return res.status(200).json({ message: "success"})
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: err })
    }
}

