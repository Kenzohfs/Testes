describe("Verificar valor", () => {
  it("Valor igual a 1200", () => {
    cy.request("GET", "http://localhost:8085/cypress").as("TodoRequest");
    cy.get("@TodoRequest").then((response) => {
      expect(response.body).to.equal(1200);
    });
  });
});

describe("Alunos", () => {
  let aluno = require("../../fixtures/aluno.json");
  let alunosLength = 0;

  it("Cadastra um aluno", () => {
    cy.request("POST", "http://localhost:8085/aluno", aluno).as("postAluno");

    cy.get("@postAluno").then((response) => {
      expect(response.body).to.have.property("nome", "João Henrique Meireles");
      aluno = { ...response.body };
    });
  });

  it("Busca todos os alunos", () => {
    cy.request("GET", "http://localhost:8085/aluno").as("getAlunos");

    cy.get("@getAlunos").then((response) => {
      alunosLength = response.body.length - 1;
      expect(response.body).to.have.length;
    });
  });

  it("Busca o aluno criado", () => {
    cy.request({
      method: "GET",
      url: `http://localhost:8085/aluno/${aluno.id}`,
      failOnStatusCode: false,
    }).as("getAluno");

    cy.get("@getAluno").then((response) => {
      expect(response.body).to.have.property("id", aluno.id);
    });
  });

  it("Cadastra um aluno com mesmo email", () => {
    cy.request(
      {
        method: "POST",
        url: "http://localhost:8085/aluno",
        failOnStatusCode: false,
      },
      aluno
    ).as("postAluno");

    cy.get("@postAluno").then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("Altera um aluno", () => {
    cy.request("PUT", `http://localhost:8085/aluno/${aluno.id}`, {
      ...aluno,
      telefone: "1234",
    }).as("putAluno");

    cy.get("@putAluno").then((response) => {
      expect(response.body).to.have.property("telefone", "1234");
    });
  });

  it("Deleta um aluno", () => {
    cy.request("DELETE", `http://localhost:8085/aluno/${aluno.id}`).as(
      "deleteAluno"
    );

    cy.get("@deleteAluno").then((response) => {
      expect(response.body).to.eq("Aluno deletado");
      expect(response.status).to.equal(200);
    });
  });

  it("Altera um aluno que não existe", () => {
    cy.request(
      {
        method: "PUT",
        url: `http://localhost:8085/aluno/${aluno.id}`,
        failOnStatusCode: false,
      },
      {
        ...aluno,
      }
    ).as("putAlunoNaoExiste");

    cy.get("@putAlunoNaoExiste").then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("Verifica se tem a mesma quantidade inicial de alunos", () => {
    cy.request("GET", "http://localhost:8085/aluno").as("getAlunos");

    cy.get("@getAlunos").then((response) => {
      expect(response.body.length).to.eq(alunosLength);
    });
  });

  it("Busca o aluno deletado", () => {
    cy.request({
      method: "GET",
      url: `http://localhost:8085/aluno/${aluno.id}`,
      failOnStatusCode: false,
    }).as("getAluno");

    cy.get("@getAluno").then((response) => {
      expect(response.status).to.equal(404);
    });
  });

  it("Verifica a duração da requisição de getAll", () => {
    cy.request("GET", "http://localhost:8085/aluno").as("getAlunos");

    cy.get("@getAlunos").then((response) => {
      expect(response.duration).to.not.be.greaterThan(10);
    });
  });
});
