docker build . -t sreejade/cron-job-manger
docker container rm crontest --force
docker run -e PORT=3033 -p 3000:3033 -v /var/run/docker.sock:/var/run/docker.sock --mount source=myvol,target=/var/lib --name=crontest -itd cron-manager
