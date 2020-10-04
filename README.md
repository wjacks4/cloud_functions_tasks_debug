Reproducible cloud task naming bug

Steps to reproduce

1) Clone repository & run 'npm install'
2) Request the 'pipeline-test.json' file from me
3) Save the 'pipeline-test.json' file in the util folder
4) run firebase serve
5) using a backend debugging tool (postman is my preferred choice) send a the following request

    {
        "contents": "sample request contents",
        "executionTime": "2020-10-20T02:09:00.000Z"
    }


    ...to the following endpoints
    
    
    http://localhost:5000/pipeline-debug/us-central1/api/successfullyCreateCloudTask
    http://localhost:5000/pipeline-debug/us-central1/api/failToCreateCloudTask

6) The two endpoints have on ONE difference - the variable assigned to the cloud task. One succeeds, one fails.
