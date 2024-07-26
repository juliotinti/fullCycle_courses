FROM golang:alpine3.19 as builder

WORKDIR /app
COPY . .

RUN go build -o helloworld helloworld.go

#scratch é uma "imagem vazia", é uma forma legal de criar imagens leves quando possível 
FROM scratch
COPY --from=builder /app/ .
CMD ["./helloworld"]