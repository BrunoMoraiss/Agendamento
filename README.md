# Agendamento
- Projeto criado para simular uma agenda, onde é possivel verificar fazer agendamentos, verificar os dias que já possui agendamentos, os horarios, nome da pessoa que tem horario marcado e a descrição.
## Front-End
- EJS - Utilizado como view engine para redenrização das paginas.
- Bootstrap - Para estilização das paginas
- FullCalendar - Para redenrizar o calendario na view
- Jquery Mask - Utilizado para customizar o campo de CPF.
## Back-End
- Framework Express 
- Mongoose - Utilizado para conexao e comunicação ao banco de dados 
- NoSQL (MongoDB) - Como banco de dados não relacional.
- NodeMailer - Utilizado para simular junto ao MailTrap como seria o envio de email as pessoas que tem horario agendado.
### Dev-Dependencies
- Nodemon - Utilizado para manter o servidor rodando mesmo após modificação no código.
## EndPoints
### GET /
- Redenrização da view Index.
#### Parametros
- Nenhum
#### Renderização view index:
![Index](https://user-images.githubusercontent.com/99517505/214403734-b33d100a-bf88-4e1d-ac67-8e09321f17a8.png)
### GET /cadastro
- Redenrização da view para cadastrar o agendamento de horario.
#### Parametros
- Nenhum
#### Renderização view create:
![Create-view](https://user-images.githubusercontent.com/99517505/214410364-28ddd0e9-e468-4c75-936f-9074369db794.png)
### POST /create
- Rota para receber todas informações enviadas da view create no back end.
#### Parametros
```
const { name, email, description, cpf, date, time } = req.body
```
#### Respostas
- Se todas informações forem cadastrada no banco de dados com sucesso, irá ser redirecionado a view principal.
- Caso haja algum problema, irá retornar "Ocorreu uma falha". 
### GET /getcalendar
- Rota para auxiliar na construção do calendario na view index. Essa rota só retorna agendamentos cujo campo 'finished' no banco de dados seja 'false'.
#### Parametros
- Nenhum
#### Status CODE 200
- Irá retornar todos agendamentos em json, cujo campo 'finished' no banco de dados seja 'false'.
#### Exemplo de resposta:
```
[{"id":"63cfdc0f9dc4c31c97277156","title":"Bruno Oliveira - Dor de dente","start":"2023-01-24T21:06:00.000Z","end":"2023-01-24T20:06:00.000Z","notified":true,"email":"pegasusbr1000@gmail.com"},{"id":"63cfde5b76871414b6cc08be","title":"Bruno Oliveira de morais - Dor de dente","start":"2023-01-24T14:30:00.000Z","end":"2023-01-24T13:30:00.000Z","notified":true,"email":"bruninho.morais58@icloud.com"},{"id":"63cfe9d6b630fb2602a2e9dc","title":"Bruno Oliveira de morais - Dor de dente","start":"2023-01-24T15:22:00.000Z","end":"2023-01-24T14:22:00.000Z","notified":true,"email":"brunomoraisads@gmail.com"}]
```
### GET /event/:id
- Rota para renderizar detalhadamente o agendamento, somente um agendamento irá ser redenrizado. 
#### Parametros
##### Req.params.id
- Id referente ao cadastro de agendamento.
#### Renderização view event:
![Event-view](https://user-images.githubusercontent.com/99517505/214428264-6390104a-b72d-429d-87da-8c6c6c8f22a6.png)
### POST /finish
- Endpoint acessado através da rota `GET /event/:id`, Utilizado para alterar o campo 'finished' no banco de dados. Fazendo com que esse agendamento não apareça mais na view principal.
#### Parametros
#### Req.body.id
- Id referente ao cadastro de agendamento.
#### Resposta:
- irá ser redirecionado a view principal
### NodeMailer
- Utilizei o node mailer junto ao `setInterval`, objetivo é fazer uma verificação a cada 5 minutos. Quando estiver a uma hora do horario agendado irá enviar um email, avisando que a consulta irá acontecer em breve.
- Após o primeiro envio o campo `notified` irá se tornar `true`, impossibilitando novos envios. A validação feita é que para enviar o email, o campo `notified` precisa ser `false`.
### Demonstração Estrutura do email: 
```
transporter.sendMail({
  from: "Bruno Morais <brunomoraisads@gmail.com>", // Email do remetente
  to: appo.email, // Email do destinatario
  subject: "Sua consulta vai acontcer em breve", // Assunto do Email
  text: "Sua consulta vai acontecer em uma hora" // Corpo do Email                     
  }).then(() => {
    console.log("Email enviado") // Caso o email sejá enviado com sucesso
  }).catch(err => {
    console.log(err) // Caso haja um problema no envio do email
  })
```                    
 
# Outras Informações 
## Classe Service
- Utilizei um service para facilitar a comunicação com o banco de dados. Tornando assim o código mais limpo.
#### Exemplo da classe Create (Utilizado para realizar a criação de agendamento no banco de dados): 
```
async Create(name, email, description, cpf, date, time){
  const newAppo = new Appointment({
    name, 
    email,
    description,
    cpf,
    date,
    time,
    finished: false,
    notified: false
  })
  try{
    await newAppo.save()
    return true
  }catch(err){
    console.log(err)
    return false
  }
}
```
