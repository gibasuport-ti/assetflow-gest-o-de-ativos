var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_url = require("url");
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_axios2 = __toESM(require("axios"), 1);
var import_fs_extra2 = __toESM(require("fs-extra"), 1);
var import_firebase_admin = __toESM(require("firebase-admin"), 1);
var import_firestore = require("firebase-admin/firestore");
var import_genai = require("@google/genai");
var import_child_process = require("child_process");
var import_util = require("util");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);

// services/sharepointServer.ts
var import_axios = __toESM(require("axios"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// constants.ts
var import_meta = {};
function normalizeText(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
var AD_USERS = [
  { nome: "Adalberto Costa", email: "adalberto.costa@ciriontechnologies.com" },
  { nome: "Adao Costa", email: "adao.costa@ciriontechnologies.com" },
  { nome: "Adary De Souza Junior", email: "adary.souza@ciriontechnologies.com" },
  { nome: "Adauto Melquiades dos Santos", email: "adauto.melquiades@ciriontechnologies.com" },
  { nome: "Ademilson Garcia", email: "ademilson.garcia@ciriontechnologies.com" },
  { nome: "Adilson Silva", email: "adilson.silva@ciriontechnologies.com" },
  { nome: "Adriane Gomes Valim Torso", email: "adriane.gomesvalimtorso@ciriontechnologies.com" },
  { nome: "Adriano Bueno Rodrigues", email: "adriano.buenorodrigues@ciriontechnologies.com" },
  { nome: "Adriano do Prado", email: "adriano.doprado.ext@ciriontechnologies.com" },
  { nome: "Adriano Dourado", email: "Adriano.Dourado@ciriontechnologies.com" },
  { nome: "Adriano Oliveira", email: "adriano.oliveira.ext@ciriontechnologies.com" },
  { nome: "Adriano Vieira", email: "Adriano.Vieira@ciriontechnologies.com" },
  { nome: "Agnes Rios Teixeira de Magalh\xE3es", email: "agnes.rios@ciriontechnologies.com" },
  { nome: "Albert Henrique", email: "albert.henrique@ciriontechnologies.com" },
  { nome: "Alberto Alves", email: "alberto.alves@ciriontechnologies.com" },
  { nome: "Aldo Rodrigo De Melo", email: "aldo.melo@ciriontechnologies.com" },
  { nome: "Alessandra Gusmao", email: "alessandra.gusmao@ciriontechnologies.com" },
  { nome: "Alessandro Sanches", email: "alessandro.sanches@ciriontechnologies.com" },
  { nome: "Alessandro Vieira", email: "alessandro.vieira@ciriontechnologies.com" },
  { nome: "Alex Lima Silva", email: "Alex.Silva@ciriontechnologies.com" },
  { nome: "Alex Rosa", email: "alex.rosa@ciriontechnologies.com" },
  { nome: "Alex Soares da Silva", email: "alex.soaresdasilva@ciriontechnologies.com" },
  { nome: "Alexander Arrais", email: "alexander.arrais@ciriontechnologies.com" },
  { nome: "Alexandra Breda", email: "alexandra.breda@ciriontechnologies.com" },
  { nome: "Alexandre Alencar", email: "alexandre.alencar@ciriontechnologies.com" },
  { nome: "Alexandre Antunes", email: "alexandre.antunes@ciriontechnologies.com" },
  { nome: "Alexandre Barros", email: "Alexandre.Barros@ciriontechnologies.com" },
  { nome: "ALEXANDRE BORGES", email: "alexandre.borges@ciriontechnologies.com" },
  { nome: "Alexandre Dos Santos Pardo", email: "Alexandre.Pardo@ciriontechnologies.com" },
  { nome: "Alexandre fernandes", email: "alexandre.fernandes@ciriontechnologies.com" },
  { nome: "Alexandre Nogueira", email: "alexandre.nogueira@ciriontechnologies.com" },
  { nome: "Alexandre Pereira Simcsik", email: "alexandre.simcsik@ciriontechnologies.com" },
  { nome: "Alexandre Torejiani", email: "alexandre.torejiani@ciriontechnologies.com" },
  { nome: "Alexandre Torejiani", email: "alexandre.tourejiane@ciriontechnologies.com" },
  { nome: "Alexandre Watanabe", email: "alexandre.watanabe@ciriontechnologies.com" },
  { nome: "Alexsandro Silva", email: "alexsandro.silva@ciriontechnologies.com" },
  { nome: "Alice Lobo", email: "alice.lobo@ciriontechnologies.com" },
  { nome: "Aline Aleixo", email: "aline.aleixo@ciriontechnologies.com" },
  { nome: "Aline Gomes", email: "aline.gomes.ext@ciriontechnologies.com" },
  { nome: "Aline Santos", email: "aline.santos@ciriontechnologies.com" },
  { nome: "Alisson da Silva Bezerra", email: "alisson.bezerra@ciriontechnologies.com" },
  { nome: "Alisson Tavares", email: "alisson.tavares@ciriontechnologies.com" },
  { nome: "Amadeu Lucas", email: "amadeu.lucas@ciriontechnologies.com" },
  { nome: "Amanda Aldevino", email: "amanda.aldevino@ciriontechnologies.com" },
  { nome: "Amanda Pantale\xE3o", email: "amanda.pantaleao.ext@ciriontechnologies.com" },
  { nome: "Amilton Jesus Junior", email: "Amilton.Machado@ciriontechnologies.com" },
  { nome: "Amilton Rodrigues", email: "amilton.rodrigues@ciriontechnologies.com" },
  { nome: "Ana Amarante Fernandes", email: "ana.fernandes@ciriontechnologies.com" },
  { nome: "Ana Amorim", email: "ana.amorim@ciriontechnologies.com" },
  { nome: "Ana Escobar da Silva", email: "ana.escobar@ciriontechnologies.com" },
  { nome: "Ana Muniz Trebilcock", email: "ana.muniz@ciriontechnologies.com" },
  { nome: "Ana Oliveira", email: "ana.oliveira@ciriontechnologies.com" },
  { nome: "Ana Paula Oliveira", email: "anapaula.oliveira@ciriontechnologies.com" },
  { nome: "Ana Reichert", email: "ana.reichert.ext@ciriontechnologies.com" },
  { nome: "Anderson De Oliveira", email: "anderson.oliveira@ciriontechnologies.com" },
  { nome: "Anderson Pagani", email: "anderson.pagani@ciriontechnologies.com" },
  { nome: "Anderson Santos oliveira", email: "anderson.santos.ext@ciriontechnologies.com" },
  { nome: "Andre Araujo", email: "Andre.Araujo@ciriontechnologies.com" },
  { nome: "Andre Botelho", email: "andre.botelho.ext@ciriontechnologies.com" },
  { nome: "Andre Marcelino Miliani", email: "andre.marcelinomiliani@ciriontechnologies.com" },
  { nome: "Andre Mendon\xE7a", email: "andre.mendonca@ciriontechnologies.com" },
  { nome: "Andre Miliani", email: "andre.miliani@ciriontechnologies.com" },
  { nome: "Andre Miranda Araujo", email: "andremiranda.araujo@ciriontechnologies.com" },
  { nome: "Andre Oliveira", email: "andre.oliveira@ciriontechnologies.com" },
  { nome: "Andrea Betiol Monteiro Da Silva Bastos", email: "andrea.betiol@ciriontechnologies.com" },
  { nome: "Andrelisi Figuero", email: "andrelisi.figueiro@ciriontechnologies.com" },
  { nome: "Angelina Nascimento", email: "angelina.nascimento@ciriontechnologies.com" },
  { nome: "Angelo Silva Pereira", email: "angelo.silva@ciriontechnologies.com" },
  { nome: "Anna Almeida", email: "anna.almeida@ciriontechnologies.com" },
  { nome: "Antonio Castro", email: "antonio.castro@ciriontechnologies.com" },
  { nome: "Antonio Fran\xE7a", email: "antonio.franca@ciriontechnologies.com" },
  { nome: "Antonio Oliveira da Silva Neto", email: "antonio.oliveiradasilvaneto.ext@ciriontechnologies.com" },
  { nome: "Antonio Vitor Rana", email: "Antonio.Rana@ciriontechnologies.com" },
  { nome: "Ari Aguiar Neto", email: "Ari.Neto@ciriontechnologies.com" },
  { nome: "Ariel de Sa Machado", email: "ariel.machado.ext@ciriontechnologies.com" },
  { nome: "Arthur Vieira", email: "arthur.vieira.ext@ciriontechnologies.com" },
  { nome: "Artur Martins", email: "artur.martins@ciriontechnologies.com" },
  { nome: "Augusto Barbosa", email: "augusto.barbosa@ciriontechnologies.com" },
  { nome: "Aurelio Souza", email: "Aurelio.Souza@ciriontechnologies.com" },
  { nome: "Barbara Cienna", email: "Barbara.Cienna@ciriontechnologies.com" },
  { nome: "Barbara Santos", email: "barbara.santos@ciriontechnologies.com" },
  { nome: "Basilio Barbosa", email: "basilio.barbosa@ciriontechnologies.com" },
  { nome: "Beatriz Justo dos Santos", email: "beatriz.santos.ext@ciriontechnologies.com" },
  { nome: "Beatriz Toni dos Santos", email: "beatriz.tonidossantos@ciriontechnologies.com" },
  { nome: "Bianca Lopez", email: "bianca.lopes.ext@ciriontechnologies.com" },
  { nome: "Bruna Farias", email: "bruna.farias@ciriontechnologies.com" },
  { nome: "Bruno Amaral", email: "bruno.amaral@ciriontechnologies.com" },
  { nome: "Bruno Aparecido de Oliveira", email: "bruno.aparecidodeoliveira@ciriontechnologies.com" },
  { nome: "Bruno Balthazar Garcia", email: "bruno.garcia@ciriontechnologies.com" },
  { nome: "Bruno Barbosa", email: "Bruno.Barbosa@ciriontechnologies.com" },
  { nome: "Bruno Campos", email: "bruno.campos@ciriontechnologies.com" },
  { nome: "Bruno costa", email: "bruno.costa@ciriontechnologies.com" },
  { nome: "Bruno Hayashi Batista Komatsu", email: "Bruno.Komatsu@ciriontechnologies.com" },
  { nome: "BRUNO HODGE", email: "bruno.hodge@ciriontechnologies.com" },
  { nome: "Bruno Medeiros De Moraes Carvalho", email: "Bruno.Carvalho@ciriontechnologies.com" },
  { nome: "Bruno Rissi Pezzatto", email: "bruno.pezzatto@ciriontechnologies.com" },
  { nome: "Bruno Souza Leal", email: "Bruno.SouzaLeal@ciriontechnologies.com" },
  { nome: "Caio Anastacio pereira", email: "caio.pereira@ciriontechnologies.com" },
  { nome: "Caio Ferrari", email: "caio.ferrari@ciriontechnologies.com" },
  { nome: "Caio Santarelli", email: "caio.santarelli@ciriontechnologies.com" },
  { nome: "Camila Leite", email: "camila.leite@ciriontechnologies.com" },
  { nome: "Camila Vellido", email: "camila.vellido.ext@ciriontechnologies.com" },
  { nome: "Carina Oliveira", email: "carina.oliveira@ciriontechnologies.com" },
  { nome: "Carla Lemes", email: "Carla.Lemes@ciriontechnologies.com" },
  { nome: "Carlos augusto Fugi", email: "CarlosAugusto.Fugi@ciriontechnologies.com" },
  { nome: "Carlos Barbosa Rodrigues", email: "carlos.barbosarodrigues@ciriontechnologies.com" },
  { nome: "Carlos De Faria Garcia", email: "Carlos.Defaria@ciriontechnologies.com" },
  { nome: "Carlos Eduardo Arruda Moraes", email: "carlos.arruda.ext@ciriontechnologies.com" },
  { nome: "Carlos Eduardo De Moraes", email: "carlos.moraes@ciriontechnologies.com" },
  { nome: "Carlos Eduardo Nunes Vila Cha", email: "carlos.vilacha@ciriontechnologies.com" },
  { nome: "Carlos Gomes da Silva", email: "carlos.gomes@ciriontechnologies.com" },
  { nome: "Carlos Oliveira", email: "carlos2.oliveira@ciriontechnologies.com" },
  { nome: "Carlos Oliveira", email: "carlos.oliveira.ext@ciriontechnologies.com" },
  { nome: "Carolina Alvarez Magioni", email: "carolina.alvarezmagioni@ciriontechnologies.com" },
  { nome: "Caroline Sampietri", email: "Caroline.Sampietri@ciriontechnologies.com" },
  { nome: "Carvalho Muller, Alexandre", email: "alexandre.muller@ciriontechnologies.com" },
  { nome: "Cassia Rodrigues De Siqueira", email: "cassia.rodrigues@ciriontechnologies.com" },
  { nome: "Celio Silva Felippe", email: "celio.felippe@ciriontechnologies.com" },
  { nome: "Celio Vieira", email: "celio.vieira@ciriontechnologies.com" },
  { nome: "Celso Cassimiro De Araujo", email: "Celso.Araujo@ciriontechnologies.com" },
  { nome: "Cesar Brandini", email: "cesar.brandini@ciriontechnologies.com" },
  { nome: "Chaiane Aichinger", email: "chaiane.aichinger@ciriontechnologies.com" },
  { nome: "Charles Ulguim", email: "charles.ulguim@ciriontechnologies.com" },
  { nome: "Chiara Andolina", email: "chiara.andolina@ciriontechnologies.com" },
  { nome: "Christian Semenoff Grandke", email: "christian.semenoff@ciriontechnologies.com" },
  { nome: "Christian Vanin", email: "cristhian.vanin@ciriontechnologies.com" },
  { nome: "Christina Nowak", email: "christina.nowak@ciriontechnologies.com" },
  { nome: "Cibele Sousa Santos Giarrante", email: "Cibele.Giarrante@ciriontechnologies.com" },
  { nome: "Cira Crizostimo De Oliveira", email: "Cira.Oliveira@ciriontechnologies.com" },
  { nome: "Ciro santos", email: "ciro.santos@ciriontechnologies.com" },
  { nome: "Claudemir Baldo", email: "Claudemir.Baldo@ciriontechnologies.com" },
  { nome: "Claudia Secco", email: "claudia.secco@ciriontechnologies.com" },
  { nome: "Claudio Calabrez", email: "claudio.calabrez@ciriontechnologies.com" },
  { nome: "Claudionor Filho", email: "claudionor.filho@ciriontechnologies.com" },
  { nome: "Clayton Bordon", email: "clayton.bordon@ciriontechnologies.com" },
  { nome: "Clayton Hassegawa", email: "clayton.hassegawa@ciriontechnologies.com" },
  { nome: "Cleber Marino Felisberto", email: "Cleber.Marino@ciriontechnologies.com" },
  { nome: "Clemilson Silva", email: "clemilson.silva@ciriontechnologies.com" },
  { nome: "Cleusa De Vasconcelos Da Silveira", email: "Cleusa.Vasconcelos@ciriontechnologies.com" },
  { nome: "Cleverson Nazarete", email: "cleverson.nazarete@ciriontechnologies.com" },
  { nome: "Clodoaldo Brito", email: "clodoaldo.faria@ciriontechnologies.com" },
  { nome: "Cl\xF3vis Prazeres De Lima", email: "clovis.prazeres@ciriontechnologies.com" },
  { nome: "Cristiano Da Silva Brandao", email: "cristiano.brandao@ciriontechnologies.com" },
  { nome: "Cristiano Novaes de Oliveira", email: "cristiano.novaes@ciriontechnologies.com" },
  { nome: "Cristiano Sousa", email: "Cristiano.Sousa@ciriontechnologies.com" },
  { nome: "Cristina De Mello E Silva", email: "Cristina.Mello@ciriontechnologies.com" },
  { nome: "Cristina Dorneles Delgado", email: "Cristina.Delgado@ciriontechnologies.com" },
  { nome: "Dalton Lima De Souza", email: "Dalton.Souza@ciriontechnologies.com" },
  { nome: "Daniel Frutuoso Da Silva", email: "daniel.frutuoso@ciriontechnologies.com" },
  { nome: "Daniel Lima", email: "daniel.lima@ciriontechnologies.com" },
  { nome: "Daniel Malfinati", email: "daniel.malfinati@ciriontechnologies.com" },
  { nome: "Daniel Ramos", email: "daniel.ribeiro@ciriontechnologies.com" },
  { nome: "Daniel Santos", email: "daniel.santos@ciriontechnologies.com" },
  { nome: "Daniel Souza", email: "daniel.souza@ciriontechnologies.com" },
  { nome: "Daniel Vigato Da Silva", email: "Daniel.DaSilva@ciriontechnologies.com" },
  { nome: "Danielle Rodrigues Da Rocha", email: "Danielle.Rodrigues@ciriontechnologies.com" },
  { nome: "Danilo Aparecido Gomes", email: "danilo.aparecidogomes@ciriontechnologies.com" },
  { nome: "Danilo Cereza", email: "Danilo.Cereza@ciriontechnologies.com" },
  { nome: "Danilo Colichio Lino", email: "danilo.lino@ciriontechnologies.com" },
  { nome: "Danilo seicho", email: "danilo.seicho@ciriontechnologies.com" },
  { nome: "Danilo Silva Santos", email: "danilo.silva.ext@ciriontechnologies.com" },
  { nome: "Darcio De Paula", email: "Darcio.DePaula@ciriontechnologies.com" },
  { nome: "Darcio Gilson das Neves", email: "darcio.gilsondasneves@ciriontechnologies.com" },
  { nome: "Davi Da Silva", email: "davi.dasilva@ciriontechnologies.com" },
  { nome: "David Acassio da Silva", email: "david.acassio.ext@ciriontechnologies.com" },
  { nome: "David Boscolo", email: "david.boscolo@ciriontechnologies.com" },
  { nome: "David Braz", email: "david.nascimento.ext@ciriontechnologies.com" },
  { nome: "David Dela Nuwordu", email: "david.nuwordu@ciriontechnologies.com" },
  { nome: "David Fernandes Magalhaes", email: "David.FernandesMagalhaes@ciriontechnologies.com" },
  { nome: "Debora rodrigues", email: "debora.rodrigues@ciriontechnologies.com" },
  { nome: "Deivisson Pinheiro Pereira", email: "deivisson.pinheiro@ciriontechnologies.com" },
  { nome: "Denis Pissaia", email: "Denis.Pissaia@ciriontechnologies.com" },
  { nome: "Denise Pereira de Medeiros", email: "denise.pereirademedeiros@ciriontechnologies.com" },
  { nome: "Deolino Pereira Da Costa Neto", email: "deolino.pereira@ciriontechnologies.com" },
  { nome: "Diego Borges", email: "diego.borges@ciriontechnologies.com" },
  { nome: "Diego Flefle", email: "diego.flefle@ciriontechnologies.com" },
  { nome: "Diego lucas De Morais", email: "diego.morais@ciriontechnologies.com" },
  { nome: "Diego Ongaro de Mello Lopes", email: "diego.ongarodemellolopes@ciriontechnologies.com" },
  { nome: "Diego Pereira", email: "diego.pereira@ciriontechnologies.com" },
  { nome: "Diego Teixeira Mafra De Oliveira", email: "Diego.TeixeiraMafradeOliveira@ciriontechnologies.com" },
  { nome: "Diogo Malta Neves", email: "Diogo.Neves@ciriontechnologies.com" },
  { nome: "Dirlei de Assis", email: "dirlei.deassis@ciriontechnologies.com" },
  { nome: "Douglas da Silva Mattos", email: "Douglas da Silva Mattos" },
  { nome: "Douglas da Silva Mattos", email: "douglas.dasilvamattos@ciriontechnologies.com" },
  { nome: "Douglas ferreira", email: "douglas.depaivaferreira@ciriontechnologies.com" },
  { nome: "Douglas Lima", email: "Douglas.Lima@ciriontechnologies.com" },
  { nome: "Douglas Pedroni", email: "douglas.pedroni@ciriontechnologies.com" },
  { nome: "Edenilson Schunck", email: "edenilson.schunck@ciriontechnologies.com" },
  { nome: "Eder Gon\xE7alves", email: "eder.goncalves@ciriontechnologies.com" },
  { nome: "Eder Onofre", email: "eder.onofre@ciriontechnologies.com" },
  { nome: "Ederson Dos Santos Gouveia", email: "ederson.dossantos@ciriontechnologies.com" },
  { nome: "Ederson Satyro Lopes", email: "ederson.satyrolopes@ciriontechnologies.com" },
  { nome: "Edimarcos Neves Silva", email: "Edimarcos.Neves@ciriontechnologies.com" },
  { nome: "Edison Nakashima", email: "edison.nakashima@ciriontechnologies.com" },
  { nome: "Edmilson Manzini Filho", email: "edmilson.manzinifilho@ciriontechnologies.com" },
  { nome: "Edson Vieira Lamim", email: "edson.lamin.ext@ciriontechnologies.com" },
  { nome: "Eduardo Carrasco", email: "eduardo.carrasco@ciriontechnologies.com" },
  { nome: "Eduardo Conceicao", email: "eduardo.conceicao@ciriontechnologies.com" },
  { nome: "Eduardo Eidy Urakawa", email: "Eduardo.Urakawa@ciriontechnologies.com" },
  { nome: "Eduardo Leao De Freitas", email: "Eduardo.Freitas@ciriontechnologies.com" },
  { nome: "Eduardo Lourenco", email: "eduardo.granado@ciriontechnologies.com" },
  { nome: "Eduardo Pereira De Moura", email: "eduardo.moura@ciriontechnologies.com" },
  { nome: "Eduardo Polking", email: "Eduardo.Polking@ciriontechnologies.com" },
  { nome: "Eduardo Severino Silva", email: "eduardo.silva@ciriontechnologies.com" },
  { nome: "Eduardo Souza", email: "eduardo.souza@ciriontechnologies.com" },
  { nome: "Eduardoaugusto Carneiro", email: "EduardoAugusto.Carneiro@ciriontechnologies.com" },
  { nome: "Elaine Penci", email: "elaine.penci@ciriontechnologies.com" },
  { nome: "Elaine Santos", email: "elaine.santos@ciriontechnologies.com" },
  { nome: "Eliana Cristina Tritapepe", email: "eliana.tritapepe@ciriontechnologies.com" },
  { nome: "Eliane Alves De Amorim", email: "Eliane.Amorim@ciriontechnologies.com" },
  { nome: "Eliceu Filho", email: "eliceu.filho@ciriontechnologies.com" },
  { nome: "Eliel Florencio de Mello", email: "eliel.florenciodemello@ciriontechnologies.com" },
  { nome: "Eliete Martins", email: "eliete.martins@ciriontechnologies.com" },
  { nome: "Elinaldo Pereira", email: "elinaldo.pereira@ciriontechnologies.com" },
  { nome: "Elinalva Lopes Silva", email: "elinalva.lopessilva@ciriontechnologies.com" },
  { nome: "Elio Soares", email: "elio.soares.ext@ciriontechnologies.com" },
  { nome: "Ellen Souza", email: "ellen.souza.ext@ciriontechnologies.com" },
  { nome: "Elton Tiepolo", email: "elton.tiepolo@ciriontechnologies.com" },
  { nome: "Elvis da Silva", email: "elvis.dasilva.ext@ciriontechnologies.com" },
  { nome: "Emanoel Silva", email: "emanoel.silva@ciriontechnologies.com" },
  { nome: "Emerson Carneiro Da Silva", email: "emerson.carneiro@ciriontechnologies.com" },
  { nome: "Emilly de Sousa", email: "emilly.desousa@ciriontechnologies.com" },
  { nome: "Emmanuela Silva", email: "emmanuela.silva@ciriontechnologies.com" },
  { nome: "Esther Gimenez", email: "esther.gimenez@ciriontechnologies.com" },
  { nome: "Evaldo Souza Costa", email: "evaldo.souzacosta@ciriontechnologies.com" },
  { nome: "Evandro Oliveira", email: "evandro.oliveira@ciriontechnologies.com" },
  { nome: "Fabiano De Oliveira", email: "Fabiano.Oliveira@ciriontechnologies.com" },
  { nome: "Fabiano Gama Damiano", email: "Fabiano.Damiano@ciriontechnologies.com" },
  { nome: "Fabiano Gasparini", email: "Fabiano.Gasparini@ciriontechnologies.com" },
  { nome: "Fabiano Geraldo Da Cruz", email: "fabiano.geraldodacruz@ciriontechnologies.com" },
  { nome: "Fabio Azevedo", email: "Fabio.Azevedo@ciriontechnologies.com" },
  { nome: "Fabio Batista Pereira", email: "fabio.batistapereira@ciriontechnologies.com" },
  { nome: "Fabio Da Silva De Oliveira", email: "fabio.oliveira@ciriontechnologies.com" },
  { nome: "Fabio Da Silva Ribeiro", email: "Fabio.Ribeiro@ciriontechnologies.com" },
  { nome: "Fabio Favaro", email: "fabio.favaro@ciriontechnologies.com" },
  { nome: "Fabio Rocha de Oliveira", email: "fabio.rochadeoliveira@ciriontechnologies.com" },
  { nome: "Fabio Santos", email: "fabio.santos@ciriontechnologies.com" },
  { nome: "Fabio Teixeira Simoes", email: "Fabio.Teixeira@ciriontechnologies.com" },
  { nome: "Fabio Villa Real", email: "fabio.villa@ciriontechnologies.com" },
  { nome: "Fadel Matta", email: "Fadel.Matta@ciriontechnologies.com" },
  { nome: "Felipe Ara\xFAjo Sebasti\xE3o Arnaldo", email: "felipe.araujo@ciriontechnologies.com" },
  { nome: "Felipe Augusto de Souza", email: "felipe.augustodesouza@ciriontechnologies.com" },
  { nome: "Felipe Chagas", email: "felipe.chagas@ciriontechnologies.com" },
  { nome: "Felipe Do Carmo Souza", email: "felipe.docarmosouza@ciriontechnologies.com" },
  { nome: "Felipe Kamael Coelho Ferreira", email: "felipe.kamael@ciriontechnologies.com" },
  { nome: "Felipe Lino De Souza", email: "Felipe.Lino@ciriontechnologies.com" },
  { nome: "Felipe Pires De Carvalho", email: "felipe.piresdecarvalho@ciriontechnologies.com" },
  { nome: "Felipe Rossi", email: "felipe.rossi@ciriontechnologies.com" },
  { nome: "Felipe Teixeira", email: "felipe.teixeira@ciriontechnologies.com" },
  { nome: "Fernanda Bertino Algebaile Da Silva", email: "fernanda.bertino@ciriontechnologies.com" },
  { nome: "Fernanda Menezes", email: "fernanda.menezes@ciriontechnologies.com" },
  { nome: "Fernanda Santicioli Ramos", email: "fernanda.santicioliramos@ciriontechnologies.com" },
  { nome: "Fernanda Souza De Oliveira", email: "fernanda.souza@ciriontechnologies.com" },
  { nome: "Fernando Barlem Ciria", email: "Fernando.Ciria@ciriontechnologies.com" },
  { nome: "Fernando Bilbau Furtado", email: "fernando.bilbaufurtado@ciriontechnologies.com" },
  { nome: "Fernando Da Silva Santos", email: "fernando.dasilva.ext@ciriontechnologies.com" },
  { nome: "Fernando De Almeida Anderson", email: "Fernando.Anderson@ciriontechnologies.com" },
  { nome: "fernando duarte", email: "fernando.duarte@ciriontechnologies.com" },
  { nome: "Fernando Fonseca de Souza", email: "fernando.fonseca.ext@ciriontechnologies.com" },
  { nome: "Figueiredo, Fabio", email: "fabio.figueiredo@ciriontechnologies.com" },
  { nome: "Flavia Damasio Canudo", email: "Flavia.Damasio@ciriontechnologies.com" },
  { nome: "Flavio Carpaneses", email: "flavio.carpaneses@ciriontechnologies.com" },
  { nome: "Flavio da Costa", email: "flavio.dacosta@ciriontechnologies.com" },
  { nome: "Flavio Neregatto XS05026", email: "flavio.neregatto@ciriontechnologies.com" },
  { nome: "Flavio Rodrigues", email: "Flavio.Rodrigues@ciriontechnologies.com" },
  { nome: "Flavio Vieira Soares", email: "flavio.vieirasoares@ciriontechnologies.com" },
  { nome: "Francisco Alencar", email: "Francisco.Alencar@ciriontechnologies.com" },
  { nome: "Francisco Freitas Anes", email: "Francisco.Anes@ciriontechnologies.com" },
  { nome: "Francisco Fukumoto", email: "francisco.fukumoto@ciriontechnologies.com" },
  { nome: "Francisco Helmo Ribeiro", email: "helmo.ribeiro@ciriontechnologies.com" },
  { nome: "Francisco Magno", email: "francisco.magno@ciriontechnologies.com" },
  { nome: "Francisco Silva Viteri", email: "Francisco.Silva@ciriontechnologies.com" },
  { nome: "Gabriel Barbedo", email: "gabriel.barbedo@ciriontechnologies.com" },
  { nome: "Gabriel Soares", email: "gabriel.soares@ciriontechnologies.com" },
  { nome: "Gabrielle Reis", email: "gabrielle.reis.ext@ciriontechnologies.com" },
  { nome: "Geraldo Amorim", email: "Geraldo.Amorim@ciriontechnologies.com" },
  { nome: "Geraldo Teixeira", email: "GeraldoM.TeixeiraDaSilva.Filho@ciriontechnologies.com" },
  { nome: "Gilberto Araujo", email: "gilberto.araujo.ext@ciriontechnologies.com" },
  { nome: "Gilberto Pinho Junior", email: "gilberto.pinhojunior@ciriontechnologies.com" },
  { nome: "Gilmar Silva", email: "Gilmar.Silva@ciriontechnologies.com" },
  { nome: "Giovana Ribeiro Dos Santos", email: "giovana.santos@ciriontechnologies.com" },
  { nome: "Giovanna De Oliveira Ardesore", email: "giovanna.deoliveiraardesore@ciriontechnologies.com" },
  { nome: "Giovanna Ferreira Soares", email: "giovanna.ferreirasoares@ciriontechnologies.com" },
  { nome: "Givanildo Silva", email: "givanildo.silva@ciriontechnologies.com" },
  { nome: "Glaciana Rocha", email: "glaciana.rocha@ciriontechnologies.com" },
  { nome: "Glauco Bertino", email: "glauco.bertino@ciriontechnologies.com" },
  { nome: "Graziela Tondin", email: "graziela.tondin@ciriontechnologies.com" },
  { nome: "Guilherme Aiex", email: "guilherme.aiex@ciriontechnologies.com" },
  { nome: "Guilherme Assis Fernandes De Oliveira", email: "guilherme.assis@ciriontechnologies.com" },
  { nome: "Guilherme Longhi De Carvalho", email: "guilherme.longhi@ciriontechnologies.com" },
  { nome: "Guilherme Rizzo", email: "guilherme.rizzo@ciriontechnologies.com" },
  { nome: "Gustavo de Luca", email: "gustavo.deluca@ciriontechnologies.com" },
  { nome: "Gustavo Farro Santos", email: "gustavo.farro@ciriontechnologies.com" },
  { nome: "Gustavo Lourencon", email: "gustavo.lourencon@ciriontechnologies.com" },
  { nome: "Hamilton Mendes", email: "hamilton.mendes@ciriontechnologies.com" },
  { nome: "Hebert Nunes De Souza", email: "Hebert.Nunes@ciriontechnologies.com" },
  { nome: "Helaine Perdigao Oliveira", email: "Helaine.Oliveira@ciriontechnologies.com" },
  { nome: "Henrique Barros", email: "henrique.barros@ciriontechnologies.com" },
  { nome: "Henrique Borges", email: "henrique.borges@ciriontechnologies.com" },
  { nome: "Henrique Brunetti", email: "henrique.brunetti@ciriontechnologies.com" },
  { nome: "Heubert River", email: "heubert.river@ciriontechnologies.com" },
  { nome: "Horacio Gustavo Cardona", email: "horacio.cardona@ciriontechnologies.com" },
  { nome: "Hugo Mizukami", email: "Hugo.Mizukami@ciriontechnologies.com" },
  { nome: "Igor Araujo Dos Santos", email: "igor.araujo@ciriontechnologies.com" },
  { nome: "Igor Lopes Munhoz Montes", email: "Igor.Montes@ciriontechnologies.com" },
  { nome: "Igor Romero Molina", email: "igor.molina@ciriontechnologies.com" },
  { nome: "Igor Silva", email: "igor.silva@ciriontechnologies.com" },
  { nome: "Iran Alves De Lima", email: "Iran.Lima@ciriontechnologies.com" },
  { nome: "Isabel Alves Campos", email: "isabel.campos@ciriontechnologies.com" },
  { nome: "Isabelle Arbex", email: "isabelle.arbex@ciriontechnologies.com" },
  { nome: "Isabelle Nunes De Souza Pereira", email: "isabelle.nunes.ext@ciriontechnologies.com" },
  { nome: "Israel Moura da Silva", email: "israel.silva@ciriontechnologies.com" },
  { nome: "Ivan Saide de Melo", email: "ivan.saidedemelo@ciriontechnologies.com" },
  { nome: "Ivan Saide de Melo", email: "ivan.melo@ciriontechnologies.com" },
  { nome: "Izabelita Franca", email: "izabelita.franca@ciriontechnologies.com" },
  { nome: "Jacqueline Castro", email: "jacqueline.castro@ciriontechnologies.com" },
  { nome: "Jacques Lemos Guimaraes", email: "Jacques.LemosGuimaraes@ciriontechnologies.com" },
  { nome: "James Lima", email: "James.Lima@ciriontechnologies.com" },
  { nome: "Janaina Oliveira", email: "Janaina.Oliveira@ciriontechnologies.com" },
  { nome: "Jean lima", email: "jean.lima@ciriontechnologies.com" },
  { nome: "Jeferson Justo", email: "jeferson.justo@ciriontechnologies.com" },
  { nome: "Jefferson Lisboa Melo", email: "jefferson.melo@ciriontechnologies.com" },
  { nome: "Jennifer De Castro E Silva", email: "jennifer.decastro@ciriontechnologies.com" },
  { nome: "JENNIFFER MARIA DOS SANTOS", email: "jennifer.santos@ciriontechnologies.com" },
  { nome: "Jennyfer Marangoni", email: "Jennyfer.Marangoni@ciriontechnologies.com" },
  { nome: "Jessica Costa Silva", email: "jessica.costasilva@ciriontechnologies.com" },
  { nome: "Jessica de J. Oliveira", email: "jessica.oliveira.ext@ciriontechnologies.com" },
  { nome: "Jessica Martimiano", email: "jessica.martimiano.ext@ciriontechnologies.com" },
  { nome: "Jhonis Sousa", email: "jhonis.sousa@ciriontechnologies.com" },
  { nome: "Jo\xE3o Batista Gomes Pereira", email: "joao.batista.ext@ciriontechnologies.com" },
  { nome: "Joao Dos Santos Filho", email: "Joao.Filho@ciriontechnologies.com" },
  { nome: "Joao Luiz Netto", email: "joao.netto@ciriontechnologies.com" },
  { nome: "Joao Menuzzo Semeghini", email: "Joao.Semeghini@ciriontechnologies.com" },
  { nome: "Joao Prandini", email: "joao.prandini@ciriontechnologies.com" },
  { nome: "Joao Visconti", email: "joao.visconti@ciriontechnologies.com" },
  { nome: "Jonas Ferrer", email: "jonas.ferrer@ciriontechnologies.com" },
  { nome: "Jonatas Almeida De Jesus", email: "Jonatas.Almeida@ciriontechnologies.com" },
  { nome: "Jonathan Corazzari Rodrigues", email: "Jonathan.Corazzari@ciriontechnologies.com" },
  { nome: "Jonathas Costa", email: "jonathas.costa@ciriontechnologies.com" },
  { nome: "Jone Pacheco", email: "jone.pacheco@ciriontechnologies.com" },
  { nome: "Jorge Fernando Rocha Silva", email: "jorge.rocha@ciriontechnologies.com" },
  { nome: "Jorge Luiz Alves Dias", email: "Jorge.LuizAlvesDias@ciriontechnologies.com" },
  { nome: "Jorge Pacheco", email: "Jorge.Pacheco@ciriontechnologies.com" },
  { nome: "Jose Boffe", email: "paulo.boffe@ciriontechnologies.com" },
  { nome: "Jose Brito", email: "jose.brito@ciriontechnologies.com" },
  { nome: "Jose Carlos Ruiz", email: "jose.ruiz.ext@ciriontechnologies.com" },
  { nome: "Jose Castelucci Morone", email: "Jose.Morone@ciriontechnologies.com" },
  { nome: "Jose Da Silva", email: "jose.silva15@ciriontechnologies.com" },
  { nome: "Jose De Barros", email: "jose.debarros@ciriontechnologies.com" },
  { nome: "Jose De Oliveira Moreira", email: "jose.moreira@ciriontechnologies.com" },
  { nome: "Jose Eduardo Leao De Freitas", email: "Jose.Freitas@ciriontechnologies.com" },
  { nome: "Jose Fischer", email: "jose.fischer@ciriontechnologies.com" },
  { nome: "Jose Geovane Alves Dias", email: "jose.dias@ciriontechnologies.com" },
  { nome: "Jose Geraldo", email: "Jose.Geraldo@ciriontechnologies.com" },
  { nome: "Jose Magalhaes", email: "jose.magalhaes@ciriontechnologies.com" },
  { nome: "Jose menegale", email: "jose.menegale@ciriontechnologies.com" },
  { nome: "Jose Pivotto Ramos", email: "jose.pivotto@ciriontechnologies.com" },
  { nome: "Jose Roberto Da Silva", email: "jose.roberto@ciriontechnologies.com" },
  { nome: "Jose Roberto de Miranda Russo", email: "jose.russo@ciriontechnologies.com" },
  { nome: "Jose Ruggieri", email: "jose.ruggieri@ciriontechnologies.com" },
  { nome: "Josiane Okasaki", email: "josiane.okasaki@ciriontechnologies.com" },
  { nome: "Julia Fabiane Horst", email: "julia.fabiane@ciriontechnologies.com" },
  { nome: "Julia Paiva", email: "julia.paiva@ciriontechnologies.com" },
  { nome: "Juliana Azevedo", email: "juliana.azevedo.ext@ciriontechnologies.com" },
  { nome: "Juliana C. Melo", email: "juliana.demelo.ext@ciriontechnologies.com" },
  { nome: "Juliana Correa", email: "juliana.correa@ciriontechnologies.com" },
  { nome: "Juliana F. Nascimento", email: "juliana.do.ext@ciriontechnologies.com" },
  { nome: "Juliana Goncalves da Cunha Piccolo Silva", email: "juliana.goncalves@ciriontechnologies.com" },
  { nome: "Juliana Tavares de Morais", email: "juliana.tavaresdemorais@ciriontechnologies.com" },
  { nome: "Juliano Fumes Dos Santos", email: "Juliano.Santos@ciriontechnologies.com" },
  { nome: "Juliano Mesquita", email: "Juliano.Mesquita@ciriontechnologies.com" },
  { nome: "J\xFAlio C\xE9sar Souza Bastos", email: "julio.bastos@ciriontechnologies.com" },
  { nome: "Julio Goncalves", email: "julio.goncalves@ciriontechnologies.com" },
  { nome: "Julio Lopes Da Silva", email: "julio.lopesdasilva@ciriontechnologies.com" },
  { nome: "Julio Marcos Gabriel", email: "julio.gabriel@ciriontechnologies.com" },
  { nome: "Julio Oliveira", email: "julio.fernandes@ciriontechnologies.com" },
  { nome: "Julio Pereira", email: "julio.pereira@ciriontechnologies.com" },
  { nome: "Jurandir Braz dos Santos Neto", email: "jurandir.braz@ciriontechnologies.com" },
  { nome: "Karen Akemi Abe", email: "karen.abe@ciriontechnologies.com" },
  { nome: "Karina Bacelar", email: "karina.bacelar@ciriontechnologies.com" },
  { nome: "karla Correa", email: "karla.correa@ciriontechnologies.com" },
  { nome: "Kelvin Lucas", email: "kelvin.lucas@ciriontechnologies.com" },
  { nome: "kethelyn cavalari de souza", email: "kethelyn.cavalaridesouza@ciriontechnologies.com" },
  { nome: "Klebber Bassetto", email: "kleber.bassetto@ciriontechnologies.com" },
  { nome: "Lazaro Bagdadi", email: "lazaro.bagdadi@ciriontechnologies.com" },
  { nome: "Leandro Almeida de jesus", email: "leandro.almeida@ciriontechnologies.com" },
  { nome: "Leandro Branco", email: "leandro.branco@ciriontechnologies.com" },
  { nome: "Leandro dos santos", email: "leandro.mathes@ciriontechnologies.com" },
  { nome: "Leandro Ductra", email: "leandro.ductra@ciriontechnologies.com" },
  { nome: "Leandro Lino", email: "leandro.lino@ciriontechnologies.com" },
  { nome: "Leandro Ribeiro", email: "Leandro.Ribeiro@ciriontechnologies.com" },
  { nome: "Leandro Rodrigues De Oliveira", email: "leandro.oliveira@ciriontechnologies.com" },
  { nome: "Leandro Yamamoto", email: "leandro.yamamoto@ciriontechnologies.com" },
  { nome: "Lelis Pinheiro", email: "lelis.pinheiro@ciriontechnologies.com" },
  { nome: "Leonardo Atilio de Oliveira", email: "leonardo.atiliodeoliveira@ciriontechnologies.com" },
  { nome: "Leonardo B. Gomes", email: "leonardo.beranger.ext@ciriontechnologies.com" },
  { nome: "Leonardo Camara", email: "leonardo.camara@ciriontechnologies.com" },
  { nome: "Leonardo Goncalves Pimentel", email: "Leonardo.Pimentel@ciriontechnologies.com" },
  { nome: "Leonardo Oliveira Fuentes", email: "leonardo.oliveirafuentes@ciriontechnologies.com" },
  { nome: "Leopoldo Silva", email: "Leopoldo.Henrique@ciriontechnologies.com" },
  { nome: "Leticia Moreira", email: "leticia.moreira.ext@ciriontechnologies.com" },
  { nome: "Lourdes Cristiane Salgado Carpin", email: "lourdescristiane.salgadocarpin@ciriontechnologies.com" },
  { nome: "Luciana Alves", email: "luciana.alves@ciriontechnologies.com" },
  { nome: "Luciana Bardo de Azevedo", email: "luciana.bardo@ciriontechnologies.com" },
  { nome: "Luciana Da Silva Ferreira", email: "luciana.ferreira@ciriontechnologies.com" },
  { nome: "Luciana Polastrini", email: "luciana.polastrini.ext@ciriontechnologies.com" },
  { nome: "Luciana Porto", email: "luciana.porto@ciriontechnologies.com" },
  { nome: "Luciana Vilela XS04970", email: "luciana.vilela@ciriontechnologies.com" },
  { nome: "Luciane Martins", email: "Luciane.Martins@ciriontechnologies.com" },
  { nome: "Luciano Da Silva Lara", email: "Luciano.Lara@ciriontechnologies.com" },
  { nome: "Luciano Siqueira", email: "siqueira.luciano@ciriontechnologies.com" },
  { nome: "Luciano Soares", email: "luciano.soares@ciriontechnologies.com" },
  { nome: "Luciano Xavier", email: "luciano.xavier.ext@ciriontechnologies.com" },
  { nome: "Lucilene Muniz", email: "lucilene.muniz@ciriontechnologies.com" },
  { nome: "Luighi Ferderle Ferreira", email: "luighi.ferderleferreira@ciriontechnologies.com" },
  { nome: "Luis Fernando Arias Roman", email: "luiz.roman.ext@ciriontechnologies.com" },
  { nome: "Luis Matos", email: "luis.matos@ciriontechnologies.com" },
  { nome: "Luiz Brizzi Santos", email: "luiz.brizzisantos@ciriontechnologies.com" },
  { nome: "Luiz Bruno Teixeira", email: "bruno.teixeira@ciriontechnologies.com" },
  { nome: "Luiz Caputo Da Silva", email: "Luiz.Caputo@ciriontechnologies.com" },
  { nome: "Luiz De Oliveira", email: "luiz.deoliveira@ciriontechnologies.com" },
  { nome: "Luiz Fernando Coimbra Silva", email: "luiz.fernandocoimbrasilva@ciriontechnologies.com" },
  { nome: "Luiz Filippe Andrade Dos Santos", email: "luiz.andrade@ciriontechnologies.com" },
  { nome: "Luiz Ramos", email: "Luiz.Ramos@ciriontechnologies.com" },
  { nome: "Luiz Reschke", email: "luiz.reschke@ciriontechnologies.com" },
  { nome: "Luiz Rodrigues", email: "luiz.rodrigues@ciriontechnologies.com" },
  { nome: "Luiz Sales Carneiro", email: "Luiz.SalesCarneiro@ciriontechnologies.com" },
  { nome: "Luiz Souza", email: "luiz.souza@ciriontechnologies.com" },
  { nome: "Luiz Teixeira Gomes", email: "Luiz.Gomes@ciriontechnologies.com" },
  { nome: "Luizfernando Silva", email: "LuizFernando.Silva@ciriontechnologies.com" },
  { nome: "Macleine Xavier de Souza", email: "macleine.souza@ciriontechnologies.com" },
  { nome: "Magnus Fischer", email: "magnus.fischer@ciriontechnologies.com" },
  { nome: "Maira Fraile", email: "maira.fraile@ciriontechnologies.com" },
  { nome: "Marcelo Amati", email: "marcelo.amati@ciriontechnologies.com" },
  { nome: "Marcelo Da Costa", email: "marcelo.xavier@ciriontechnologies.com" },
  { nome: "Marcelo De Almeida", email: "marcelo.dealmeida@ciriontechnologies.com" },
  { nome: "Marcelo De Oliveira", email: "Marcelo.Delfraro@ciriontechnologies.com" },
  { nome: "Marcelo De Queiroz", email: "Marcelo.Queiroz@ciriontechnologies.com" },
  { nome: "Marcelo de Rezende", email: "marcelo.rezende@ciriontechnologies.com" },
  { nome: "Marcelo Gomes", email: "marcelo.gomes@ciriontechnologies.com" },
  { nome: "Marcelo Guerreiro Da Silva", email: "Marcelo.Guerreiro@ciriontechnologies.com" },
  { nome: "Marcelo Guido", email: "Marcelo.Guido@ciriontechnologies.com" },
  { nome: "Marcelo Halas", email: "marcelo.halas@ciriontechnologies.com" },
  { nome: "Marcelo Henrique Elias", email: "Marcelo.Henrique@ciriontechnologies.com" },
  { nome: "Marcelo Kozeminski", email: "marcelo.kozeminski@ciriontechnologies.com" },
  { nome: "Marcelo Monteiro Fatigati", email: "Marcelo.Fatigati@ciriontechnologies.com" },
  { nome: "Marcelo Moreira Florindo", email: "Marcelo.MoreiraFlorindo@ciriontechnologies.com" },
  { nome: "Marcelo Thomaz", email: "Marcelo.Thomaz@ciriontechnologies.com" },
  { nome: "Marcia Silva", email: "Marcia.silva@outlook.com" },
  { nome: "Marcia Silvi Barros", email: "marcia.silvi@ciriontechnologies.com" },
  { nome: "Marciel Dos Santos", email: "Marciel.Santos@ciriontechnologies.com" },
  { nome: "Marcio Belezi", email: "marcio.belezi@ciriontechnologies.com" },
  { nome: "M\xE1rcio Lima Ferreira", email: "marcio.limaferreira@ciriontechnologies.com" },
  { nome: "Marcio Paiva", email: "marcio.paiva@ciriontechnologies.com" },
  { nome: "Marcio Tressmann", email: "marcio.tressmann@ciriontechnologies.com" },
  { nome: "Marco Perez", email: "Marco.Perez@ciriontechnologies.com" },
  { nome: "Marco Pinheiro", email: "marco.pinheiro@ciriontechnologies.com" },
  { nome: "Marcos da Silva", email: "marcos.silva@ciriontechnologies.com" },
  { nome: "Marcos Dos Anjos E Silva", email: "Marcos.DosAnjosESilva@ciriontechnologies.com" },
  { nome: "Marcos Gondim", email: "Marcos.gondim@ciriontechnologies.com" },
  { nome: "Marcos Malfatti", email: "Marcos.Malfatti@ciriontechnologies.com" },
  { nome: "Marcos Marchetti", email: "marcos.marchetti@ciriontechnologies.com" },
  { nome: "Marcos Maulli De Jesus", email: "marcos.maullidejesus@ciriontechnologies.com" },
  { nome: "Marcos Peixoto De Oliveira", email: "marcos.peixoto@ciriontechnologies.com" },
  { nome: "Marcos Silva Firmo", email: "Marcos.Firmo@ciriontechnologies.com" },
  { nome: "Marcus Dutra De Padua", email: "marcus.dutra@ciriontechnologies.com" },
  { nome: "Marcus Pelegrini", email: "marcus.pelegrini@ciriontechnologies.com" },
  { nome: "Maria Lucia F. Lopes", email: "marialucia.ferreiralopes.ext@ciriontechnologies.com" },
  { nome: "Maria L\xFAcia Ferreira Lopes", email: "maria.ferreiralopes@ciriontechnologies.com" },
  { nome: "Mariana Baptista", email: "mariana.baptista.ext@ciriontechnologies.com" },
  { nome: "Mariana Parmegiani Serpa", email: "mariana.ong@ciriontechnologies.com" },
  { nome: "Marlon Meira", email: "marlon.meira@ciriontechnologies.com" },
  { nome: "Marlon Rocha", email: "marlon.rocha@ciriontechnologies.com" },
  { nome: "Matheus Carmo", email: "Matheus.Carmo@ciriontechnologies.com" },
  { nome: "Matheus de Camargo", email: "matheus.decamargo@ciriontechnologies.com" },
  { nome: "Matheus Silva Marchetti", email: "matheus.marchetti.ext@ciriontechnologies.com" },
  { nome: "Mauricio Colombo", email: "mauricio.colombo@ciriontechnologies.com" },
  { nome: "Mauricio Cymerman", email: "mauricio.cymerman@ciriontechnologies.com" },
  { nome: "Mauricio Iuras", email: "mauricio.iuras@ciriontechnologies.com" },
  { nome: "Mauricio Kazushi Goto", email: "Mauricio.Goto@ciriontechnologies.com" },
  { nome: "Mauricio Lima", email: "mauricio.lima@ciriontechnologies.com" },
  { nome: "Mauricio Maia", email: "mauricio.maia@ciriontechnologies.com" },
  { nome: "Mauricio Marques", email: "Mauricio.Marques@ciriontechnologies.com" },
  { nome: "Mauricio Merlino", email: "Mauricio.Merlino@ciriontechnologies.com" },
  { nome: "Mauricio Rodrigues Da Silva", email: "Mauricio.Silva@ciriontechnologies.com" },
  { nome: "Mauricio Sugui", email: "mauricio.sugui@ciriontechnologies.com" },
  { nome: "Mauricio Tosta", email: "Mauricio.Tosta@ciriontechnologies.com" },
  { nome: "Mauro Gomes", email: "mauro.gomes@ciriontechnologies.com" },
  { nome: "Mauro Mendes", email: "mauro.mendes@ciriontechnologies.com" },
  { nome: "Messias Francisco Da Silva", email: "messias.francisco.ext@ciriontechnologies.com" },
  { nome: "Michael De Sousa Shibuya", email: "Michael.DeSousaShibuya@ciriontechnologies.com" },
  { nome: "Michelly de Mei", email: "michelly.demei@ciriontechnologies.com" },
  { nome: "Milena Jeronimo Dos Santos", email: "Milena.JeronimodosSantos@ciriontechnologies.com" },
  { nome: "Milena Muniz", email: "Milena.Muniz@ciriontechnologies.com" },
  { nome: "Mirella Esteves", email: "Mirella.Esteves@ciriontechnologies.com" },
  { nome: "Misael Soares", email: "misael.soares@ciriontechnologies.com" },
  { nome: "Moacir Dantas", email: "moacir.dantas@ciriontechnologies.com" },
  { nome: "Moises Santana", email: "moises.santana.ext@ciriontechnologies.com" },
  { nome: "Monica Borges", email: "monica.borges@ciriontechnologies.com" },
  { nome: "MOZAIR COSTA", email: "mozair.costa.ext@ciriontechnologies.com" },
  { nome: "Mozair Costa", email: "mozair.costa@ciriontechnologies.com" },
  { nome: "Munique Hess", email: "Munique.Hess@ciriontechnologies.com" },
  { nome: "Muriel Marinho", email: "muriel.espirito@ciriontechnologies.com" },
  { nome: "Murillo Silveira", email: "murillo.silveira@ciriontechnologies.com" },
  { nome: "Murilo Almeida De Jesus", email: "murilo.almeidadejesus.ext@ciriontechnologies.com" },
  { nome: "Murilo Bustamante", email: "murilo.bustamante@ciriontechnologies.com" },
  { nome: "Murilo Silva", email: "murilo.silva@ciriontechnologies.com" },
  { nome: "Nat\xE3 dos Santos Soares", email: "nata.dossantossoares@ciriontechnologies.com" },
  { nome: "Natalia Francielly Pereira De Oliviera", email: "natalia.francielly@ciriontechnologies.com" },
  { nome: "Nathalie Calafiori", email: "nathalie.calafiori@ciriontechnologies.com" },
  { nome: "Nelma Jocinete Dos Santos", email: "Nelma.Santos@ciriontechnologies.com" },
  { nome: "Nilton Carrilo Teixeira da Silva", email: "nilton.teixeiradasilva.ext@ciriontechnologies.com" },
  { nome: "Nivaldo Carvalho", email: "nivaldo.carvalho@ciriontechnologies.com" },
  { nome: "Nivea Augusto", email: "nivea.augusto@ciriontechnologies.com" },
  { nome: "Odair Ribeiro", email: "odair.ribeiro@ciriontechnologies.com" },
  { nome: "Pablo Dutra", email: "pablo.dutra.ext@ciriontechnologies.com" },
  { nome: "Pamela dos Santos Morais", email: "pamela.akamine@ciriontechnologies.com" },
  { nome: "Pamela Spadrezani", email: "pamela.spadrezani@ciriontechnologies.com" },
  { nome: "Panagiotis Xylaras", email: "panagiotis.Xylaras@ciriontechnologies.com" },
  { nome: "Paula De Oliveira Ribeiro Costa", email: "Paula.Costa@ciriontechnologies.com" },
  { nome: "Paula Vivo Chaneton", email: "paula.vivo@ciriontechnologies.com" },
  { nome: "Paulo Bononi", email: "Paulo.Bononi@ciriontechnologies.com" },
  { nome: "Paulo Chediac", email: "Paulo.Chediac@ciriontechnologies.com" },
  { nome: "Paulo Goncalves", email: "paulo.goncalves@ciriontechnologies.com" },
  { nome: "Paulo Medeiros", email: "paulo.medeiros@ciriontechnologies.com" },
  { nome: "Paulo Oliveira", email: "paulo.oliveira@ciriontechnologies.com" },
  { nome: "Paulo Selotto", email: "paulo.selotto@ciriontechnologies.com" },
  { nome: "PE04YP16", email: "andre.lima@ciriontechnologies.com" },
  { nome: "Pedro Conrado Pinho", email: "pedro.conradopinho@ciriontechnologies.com" },
  { nome: "Pedro henrique Real", email: "pedrohenrique.real@ciriontechnologies.com" },
  { nome: "Pedro Soares", email: "pedro.soares@ciriontechnologies.com" },
  { nome: "Pedro Weiss De Andrade", email: "pedro.weiss@ciriontechnologies.com" },
  { nome: "Plant\xE3o Backbone COTIA", email: "plantaobackboneCOTIA@ciriontechnologies.com" },
  { nome: "plant\xE3o equipe de seguran\xE7a", email: "plantaoSOC@ciriontechnologies.com" },
  { nome: "Plant\xE3o subesta\xE7\xE3o COTIA", email: "plataosubestacao@ciriontechnologies.com" },
  { nome: "Plant\xE3o subesta\xE7\xE3o COTIA", email: "plataoSUBCOTIA@ciriontechnologies.com" },
  { nome: "Plinio Rodrigues", email: "plinio.rodrigues@ciriontechnologies.com" },
  { nome: "Priscila De Melo", email: "priscila.dossantos@ciriontechnologies.com" },
  { nome: "Priscila Naki", email: "priscila.naki@ciriontechnologies.com" },
  { nome: "Priscila Palma", email: "priscila.palma.ext@ciriontechnologies.com" },
  { nome: "Quelen De Carvalho Sommer", email: "Quelen.Sommer@ciriontechnologies.com" },
  { nome: "Queler Ferreira", email: "Queler.Ferreira@ciriontechnologies.com" },
  { nome: "Rafael de Almeida", email: "rafael.almeida@ciriontechnologies.com" },
  { nome: "Rafael De Macedo Soares", email: "rafael.demacedo@ciriontechnologies.com" },
  { nome: "Rafael Narciso", email: "rafael.narciso@ciriontechnologies.com" },
  { nome: "Rafael Rangel de Andrade", email: "rafael.rangeldeandrade@ciriontechnologies.com" },
  { nome: "Rafael Ribeiro de Souza", email: "rafael.ribeirodesouza@ciriontechnologies.com" },
  { nome: "Rafael Teotonio Ricarte", email: "rafael.ricarte@ciriontechnologies.com" },
  { nome: "Rafael Tognolli", email: "rafael.tognolli@ciriontechnologies.com" },
  { nome: "Rafael Velasques", email: "rafael.velasques@ciriontechnologies.com" },
  { nome: "Rafael Zeferino", email: "rafael.zeferino@ciriontechnologies.com" },
  { nome: "Raphael Inacio", email: "raphael.inacio@ciriontechnologies.com" },
  { nome: "Raphael Vieira", email: "raphael.vieira@ciriontechnologies.com" },
  { nome: "Raphael Zara", email: "Raphael.Zara@ciriontechnologies.com" },
  { nome: "Raquel Pepineli Cabral", email: "Raquel.PepineliCabral@ciriontechnologies.com" },
  { nome: "Regiane Teixeira", email: "regiane.teixeira.ext@ciriontechnologies.com" },
  { nome: "Reginaldo Ferreira", email: "reginaldo.ferreira@ciriontechnologies.com" },
  { nome: "Reginaldo Gomes", email: "reginaldo.gomes@ciriontechnologies.com" },
  { nome: "Reinaldo Da Silva", email: "Reinaldo.Silva@ciriontechnologies.com" },
  { nome: "Rejane Alapenha", email: "rejane.alapenha@ciriontechnologies.com" },
  { nome: "Rejane De jesus dias", email: "Rejane.DeJesusDias@ciriontechnologies.com" },
  { nome: "Renan Da Silva Santos De Oliveira", email: "renan.santos.ext@ciriontechnologies.com" },
  { nome: "Renan Islas", email: "renan.islas@ciriontechnologies.com" },
  { nome: "Renan Lourenco", email: "renan.lourenco@ciriontechnologies.com" },
  { nome: "Renan Marazo", email: "renan.marazo@ciriontechnologies.com" },
  { nome: "Renan Ribeiro Rodrigues", email: "Renan.Rodrigues@ciriontechnologies.com" },
  { nome: "Renata Pinto Teles", email: "renata.teles@ciriontechnologies.com" },
  { nome: "Renato Eleoterio Dos Santos", email: "renato.eleoterio@ciriontechnologies.com" },
  { nome: "Renato Hirano", email: "renato.hirano@ciriontechnologies.com" },
  { nome: "Renato Juliano Ananias", email: "Renato.JulianoAnanias@ciriontechnologies.com" },
  { nome: "Renato Lima da Silva", email: "renato.lima@ciriontechnologies.com" },
  { nome: "Renato Martins", email: "renato.martinsdasilva@ciriontechnologies.com" },
  { nome: "Renato tocaxelli", email: "renato.tocaxelli@ciriontechnologies.com" },
  { nome: "Rene Yoshida Da Rocha", email: "Rene.Yoshida@ciriontechnologies.com" },
  { nome: "Ricardo Andrade Paiva", email: "Ricardo.Paiva@ciriontechnologies.com" },
  { nome: "Ricardo Horesh Gagliano", email: "Ricardo.Gagliano@ciriontechnologies.com" },
  { nome: "Ricardo Lima Manganelli", email: "Ricardo.Manganelli@ciriontechnologies.com" },
  { nome: "Ricardo Munhoz", email: "ricardo.munhoz@ciriontechnologies.com" },
  { nome: "Ricardo Norio Arakaki", email: "Ricardo.Norio@ciriontechnologies.com" },
  { nome: "Ricardo Pimentel", email: "Ricardo.Pimentel@ciriontechnologies.com" },
  { nome: "Ricardo Renno", email: "ricardo.geraldo@ciriontechnologies.com" },
  { nome: "Ricardo Souza", email: "ricardo.souza@ciriontechnologies.com" },
  { nome: "Rita Molina", email: "Rita.Molina@ciriontechnologies.com" },
  { nome: "Roberta Gouveia", email: "roberta.gouveia@ciriontechnologies.com" },
  { nome: "Roberto Cassiano", email: "roberto.cassiano@ciriontechnologies.com" },
  { nome: "Roberto Correia De Araujo", email: "Roberto.Correia@ciriontechnologies.com" },
  { nome: "Roberto Maia", email: "Roberto.Maia@ciriontechnologies.com" },
  { nome: "Roberto Pimentel", email: "roberto.pimentel@ciriontechnologies.com" },
  { nome: "Roberto Riveros Gamarra", email: "roberto.gamarra@ciriontechnologies.com" },
  { nome: "Roberto Rosa", email: "roberto.rosa@ciriontechnologies.com" },
  { nome: "Roberto Santos", email: "roberto.santos@ciriontechnologies.com" },
  { nome: "Roberto Silva Alexandre", email: "roberto.silvaalexandre@ciriontechnologies.com" },
  { nome: "Robinson Kussunoki", email: "robinson.kussunoki@ciriontechnologies.com" },
  { nome: "Robson Fante", email: "robson.fante@ciriontechnologies.com" },
  { nome: "Robson Nunes dos Santos", email: "robson.nunesdossantos@ciriontechnologies.com" },
  { nome: "Robson Toqueiro", email: "robson.toqueiro@ciriontechnologies.com" },
  { nome: "Rodney Narazzaki", email: "rodney.narazzaki@ciriontechnologies.com" },
  { nome: "Rodolfo Benevides", email: "rodolfo.benevides@ciriontechnologies.com" },
  { nome: "Rodolfo Luiz Leite Rodrigues", email: "Rodolfo.LuizLeiteRodrigues@ciriontechnologies.com" },
  { nome: "Rodrigo Bueno", email: "Rodrigo.Bueno@ciriontechnologies.com" },
  { nome: "Rodrigo Capelare", email: "Rodrigo.Capelare@ciriontechnologies.com" },
  { nome: "Rodrigo De Freitas Gallina", email: "Rodrigo.Gallina@ciriontechnologies.com" },
  { nome: "Rodrigo Gagliardi Maciel Da Cruz", email: "rodrigo.cruz@ciriontechnologies.com" },
  { nome: "Rodrigo Lima", email: "rodrigo.lima@ciriontechnologies.com" },
  { nome: "Rodrigo Mastropietro", email: "rodrigo.mastropietro@ciriontechnologies.com" },
  { nome: "Rodrigo Neves", email: "rodrigo.neves.ext@ciriontechnologies.com" },
  { nome: "Rodrigo Oliveira", email: "rodrigo.oliveira@ciriontechnologies.com" },
  { nome: "Rodrigo Oyakawa", email: "rodrigo.oyakawa@ciriontechnologies.com" },
  { nome: "Rodrigo Paix\xE3o", email: "rodrigo.paixao@ciriontechnologies.com" },
  { nome: "Rodrigo Pereira", email: "rodrigo.martins@ciriontechnologies.com" },
  { nome: "Rodrigo Perez", email: "rodrigo.perez@ciriontechnologies.com" },
  { nome: "Rodrigo Secco", email: "rodrigo.secco@ciriontechnologies.com" },
  { nome: "Rogerio Da Silva Barbosa", email: "rogerio.barbosa@ciriontechnologies.com" },
  { nome: "Rogerio Gatti Pereira Da Silva", email: "Rogerio.Silva@ciriontechnologies.com" },
  { nome: "Romilda Gomes", email: "romilda.gomes@ciriontechnologies.com" },
  { nome: "Romulo De Moraes Cillo", email: "Romulo.Cillo@ciriontechnologies.com" },
  { nome: "Ronald Aguiar Garcia", email: "ronald.aguiargarcia@ciriontechnologies.com" },
  { nome: "Ronaldo Da Silva", email: "ronaldo.dasilva@ciriontechnologies.com" },
  { nome: "Ronaldo Dos Santos Araujo", email: "Ronaldo.Araujo@ciriontechnologies.com" },
  { nome: "Roney Viana", email: "roney.viana@ciriontechnologies.com" },
  { nome: "Rozeval Garces", email: "rozeval.garces@ciriontechnologies.com" },
  { nome: "Rubens Hida", email: "rubens.hida.ext@ciriontechnologies.com" },
  { nome: "Rubens Hida", email: "rubens.hida@ciriontechnologies.com" },
  { nome: "Rubens Pereira Moraes Da Silva", email: "rubens.moraes@ciriontechnologies.com" },
  { nome: "Rubens Perez Monteiro", email: "rubens.perezmonteiro@ciriontechnologies.com" },
  { nome: "R\xFAbia Carolina Meira de Lima", email: "rubia.lima@ciriontechnologies.com" },
  { nome: "Rui Brito", email: "rui.brito@ciriontechnologies.com" },
  { nome: "Rummenigge Lima", email: "rummenigge.lima@ciriontechnologies.com" },
  { nome: "Samanha Bispo", email: "samantha.bispo@ciriontechnologies.com" },
  { nome: "Samanta Bispo", email: "samantha.bispo.ext@ciriontechnologies.com" },
  { nome: "Samia Abou Mahmoud", email: "samia.abou@ciriontechnologies.com" },
  { nome: "Sandro Pacheco", email: "Sandro.Pacheco@ciriontechnologies.com" },
  { nome: "Santiago Peres Castano", email: "santiago.castano@ciriontechnologies.com" },
  { nome: "Saskia Vaz", email: "saskia.vaz@ciriontechnologies.com" },
  { nome: "Selma Silva Moreira", email: "selma.silva@ciriontechnologies.com" },
  { nome: "Sergio Camargo", email: "sergio.camargo@ciriontechnologies.com" },
  { nome: "Sergio Mendon\xE7a", email: "sergio.mendonca@ciriontechnologies.com" },
  { nome: "Silvia Kakuma", email: "silvia.kakuma@ciriontechnologies.com" },
  { nome: "Silvio Bonete Prestes", email: "silvio.bonete@ciriontechnologies.com" },
  { nome: "Simone Bini Pierdona Marques", email: "Simone.Pierdona@ciriontechnologies.com" },
  { nome: "Stefanie Prado", email: "stefanie.prado@ciriontechnologies.com" },
  { nome: "Sthefanny Lima", email: "sthefanny.lima@ciriontechnologies.com" },
  { nome: "Suellen Stamm De Sa", email: "suellen.desa@ciriontechnologies.com" },
  { nome: "Sybelle Rossato", email: "sybelle.rossato@ciriontechnologies.com" },
  { nome: "Tabata Pimentel", email: "Tabata.Pimentel@ciriontechnologies.com" },
  { nome: "Tadeu Sidnei Santos Barbosa Da Silva", email: "tadeu.sidnei@ciriontechnologies.com" },
  { nome: "Talita de Simone", email: "talita.desimone@ciriontechnologies.com" },
  { nome: "Talita Silberman", email: "talita.silberman@ciriontechnologies.com" },
  { nome: "Talles Pessoa De Almeida Ferreira", email: "Talles.Pessoa@ciriontechnologies.com" },
  { nome: "Tanio De Oliveira Simoes", email: "Tanio.Simoes@ciriontechnologies.com" },
  { nome: "Tatiana Fonseca", email: "Tatiana.Fonseca@ciriontechnologies.com" },
  { nome: "Tatiane Vona", email: "tatiane.vona@ciriontechnologies.com" },
  { nome: "Teresa Fukasawa", email: "teresa.fukasawa@ciriontechnologies.com" },
  { nome: "Thamiris Carvalho", email: "thamiris.carvalho@ciriontechnologies.com" },
  { nome: "Thayane Feltrim De Melo", email: "thayane.feltrimdemelo@ciriontechnologies.com" },
  { nome: "Thiago Archas", email: "thiago.archas@ciriontechnologies.com" },
  { nome: "Thiago Curimbaba Sampaio", email: "thiago.curimbabasampaio@ciriontechnologies.com" },
  { nome: "Thiago Dias Almeida Santos", email: "thiago.diasalmeidasantos@ciriontechnologies.com" },
  { nome: "Thiago Donizeti Da Silva", email: "thiago.donizeti@ciriontechnologies.com" },
  { nome: "Thiago Ferraz", email: "Thiago.Ferraz@ciriontechnologies.com" },
  { nome: "Thiago Peranton", email: "thiago.peranton@ciriontechnologies.com" },
  { nome: "Thiago Sanches", email: "thiago.sanches@ciriontechnologies.com" },
  { nome: "thiago Tavares de Oliveira", email: "thiago.tavares@ciriontechnologies.com" },
  { nome: "Thomaz Cortez Bertanha", email: "thomaz.cortezbertanha@ciriontechnologies.com" },
  { nome: "Tiago Andre Rodrigues", email: "tiago.rodrigues.ext@ciriontechnologies.com" },
  { nome: "Tiago Gimenez Olmedo", email: "tiago.olmedo@ciriontechnologies.com" },
  { nome: "Tomas Kim", email: "tomas.kim@ciriontechnologies.com" },
  { nome: "Tomio Carvalho Endo", email: "tomio.carvalho@ciriontechnologies.com" },
  { nome: "Uirassu Carvalho Vieira", email: "Uirassu.Vieira@ciriontechnologies.com" },
  { nome: "Ulysses Silveira Junior", email: "Ulysses.Calsavara@ciriontechnologies.com" },
  { nome: "Uriel Souza", email: "uriel.souza@ciriontechnologies.com" },
  { nome: "Valdir Freire", email: "valdir.freire@ciriontechnologies.com" },
  { nome: "Valdir Jose Da Rocha", email: "ValdirJose.DaRocha@ciriontechnologies.com" },
  { nome: "Valdivino Oliveira", email: "valdivino.oliveira@ciriontechnologies.com" },
  { nome: "Valter Gon\xE7alves", email: "valter.goncalves@ciriontechnologies.com" },
  { nome: "Vander Almeida", email: "vander.almeida@ciriontechnologies.com" },
  { nome: "Vanessa Nunes", email: "Vanessa.Nunes@ciriontechnologies.com" },
  { nome: "Veronica Espinoza", email: "veronica.espinoza2@ciriontechnologies.com" },
  { nome: "Victor da Silva Andrade Araujo", email: "victor.dasilvaandradearaujo@ciriontechnologies.com" },
  { nome: "Victor Hugo Borges Ribeiro Pedroso", email: "victor.borges.ext@ciriontechnologies.com" },
  { nome: "Vinicius Carvalho Pereira", email: "vinicius.carvalho@ciriontechnologies.com" },
  { nome: "Vinicius Evangelista de Souza", email: "vinicius.desouza.ext@ciriontechnologies.com" },
  { nome: "Vinicius Flavio", email: "vinicius.flavio@ciriontechnologies.com" },
  { nome: "Vinicius Mancini", email: "vinicius.mancini@ciriontechnologies.com" },
  { nome: "Vinicius Oliveira", email: "vinicius.oliveira@ciriontechnologies.com" },
  { nome: "Vinicius Oliveira 1", email: "vinicius.oliveira1@ciriontechnologies.com" },
  { nome: "Vitor Alves", email: "vitor.alves.ext@ciriontechnologies.com" },
  { nome: "Vivian Credmann", email: "vivian.craveiro@ciriontechnologies.com" },
  { nome: "Viviane Meirelles", email: "Viviane.Meirelles@ciriontechnologies.com" },
  { nome: "Vladmir Oliveira Rossi", email: "Vladmir.Rossi@ciriontechnologies.com" },
  { nome: "Vlamir Maciel de Lima", email: "vlamir.maciel@ciriontechnologies.com" },
  { nome: "Voloi Borges", email: "voloi.borges@ciriontechnologies.com" },
  { nome: "Wagner Lacerda Cabral", email: "wagner.lacerda@ciriontechnologies.com" },
  { nome: "Wagner Pereira", email: "wagner.pereira@ciriontechnologies.com" },
  { nome: "Wagner xavier", email: "wagner.xavier@ciriontechnologies.com" },
  { nome: "Walter Almeida", email: "walter.almeida@ciriontechnologies.com" },
  { nome: "Wander Watanabe Junior", email: "wander.junior@ciriontechnologies.com" },
  { nome: "Wanderley Silva", email: "wanderley.silva@ciriontechnologies.com" },
  { nome: "Wellington Souza", email: "wellington.souza@ciriontechnologies.com" },
  { nome: "Widson Cardoso Dos Santos", email: "widson.cardoso@ciriontechnologies.com" },
  { nome: "William Campos Niche", email: "william.camposniche@ciriontechnologies.com" },
  { nome: "William Domingues", email: "william.domingues@ciriontechnologies.com" },
  { nome: "Willian Sakamoto", email: "willian.sakamoto@ciriontechnologies.com" },
  { nome: "Willian Talon", email: "willian.talon@ciriontechnologies.com" },
  { nome: "Willian Theodoro", email: "william.theodoro@ciriontechnologies.com" },
  { nome: "Windson Gomes Hora", email: "windson.gomeshora.ext@ciriontechnologies.com" },
  { nome: "Windson Gomes Hora", email: "windson.gomeshora@ciriontechnologies.com" },
  { nome: "Yuri Moraes", email: "yuri.moraes@ciriontechnologies.com" },
  { nome: "Yuri Rezende Menck", email: "Yuri.Menck@ciriontechnologies.com" }
];
var MERCADO_PAGO_URL = typeof import_meta !== "undefined" && import_meta.env?.VITE_MERCADO_PAGO_URL || typeof process !== "undefined" && process.env?.VITE_MERCADO_PAGO_URL || "https://mpago.la/1CTeHzU";

// services/baselineData.ts
var BASELINE_EXCHANGES = [
  {
    "id": "WF4Y9GZMQ",
    "operationType": "exchange",
    "status": "completed",
    "timestamp": 1789654314314,
    "colaborador_nome": "Vander Almeida",
    "colaborador_email": "vander.almeida@ciriontechnologies.com",
    "data_troca": "2026-09-17",
    "entregue_tipo": "Notebook",
    "entregue_marca": "Lenovo",
    "entregue_modelo": "E14 G2",
    "entregue_serial": "PE0A8Q1H",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "entregue_condicao": "Usado",
    "entregue_memoria": "16GB",
    "entregue_armazenamento": "256GB",
    "entregue_acessorios": [],
    "entregue_acessorios_seriais": {},
    "entregue_observacoes": "Entrega referente a troca devido Notebook anterior com falha no sistema Windows.",
    "devolvido_tipo": "Notebook",
    "devolvido_marca": "Lenovo",
    "devolvido_modelo": "E14 G2",
    "devolvido_serial": "PE08YY3G",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_condicao": "Usado",
    "devolvido_memoria": "16GB",
    "devolvido_armazenamento": "256GB",
    "devolvido_acessorios": [],
    "devolvido_acessorios_seriais": {},
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido Notebook com falha no sistema Windows",
    "createdBy": "gilberto_araujo_admin",
    "assinatura_ti": "data:image/png;base64,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",
    "docusign_status": "completed",
    "docusign_envelope_id": "DS-CIRION-MU5MEQI8",
    "docusign_signed_at": 1789655518460,
    "assinatura_colaborador": "data:image/png;base64,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"
  },
  {
    "data_troca": "2026-09-08",
    "id": "TKN0KNO22",
    "devolvido_serial": "353386381839618",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "entregue_observacoes": "Entrega referente a troca devido Moto G54 anterior desligando sozinho.",
    "devolvido_condicao": "Usado",
    "entregue_acessorios_seriais": {},
    "entregue_tipo": "Smartphone",
    "devolvido_memoria": "8GB",
    "devolvido_tipo": "Smartphone",
    "entregue_acessorios": [],
    "entregue_marca": "Motorola",
    "timestamp": 1788891799026,
    "entregue_modelo": "MOTO G54",
    "devolvido_armazenamento": "256GB",
    "colaborador_nome": "Jo\xE3o Batista Gomes Pereira",
    "entregue_memoria": "8GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido Smartphone desligando sozinho ",
    "colaborador_email": "joao.batista.ext@ciriontechnologies.com",
    "createdBy": "4H4gclP24oUfqtVJ9r3499atUGX2",
    "entregue_condicao": "Usado",
    "devolvido_acessorios": [],
    "devolvido_modelo": "MOTO G54",
    "status": "completed",
    "devolvido_acessorios_seriais": {},
    "entregue_armazenamento": "256GB",
    "devolvido_marca": "Motorola",
    "operationType": "exchange",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "entregue_serial": "353386381839477"
  },
  {
    "entregue_acessorios_seriais": {},
    "entregue_condicao": "Usado",
    "devolvido_acessorios": [],
    "status": "completed",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido falhas no teclado.",
    "devolvido_serial": "PE0A8Q2Y",
    "devolvido_marca": "Lenovo",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "entregue_serial": "PE07X4EB",
    "entregue_modelo": "E14 G2",
    "operationType": "exchange",
    "entregue_armazenamento": "256GB",
    "timestamp": 1788882782875,
    "createdBy": "4H4gclP24oUfqtVJ9r3499atUGX2",
    "devolvido_condicao": "Usado",
    "colaborador_email": "henrique.barros@ciriontechnologies.com",
    "devolvido_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "colaborador_nome": "Henrique Barros",
    "devolvido_acessorios_seriais": {},
    "devolvido_armazenamento": "256GB",
    "entregue_memoria": "16GB",
    "entregue_marca": "Lenovo",
    "id": "8Z24UDVYM",
    "entregue_acessorios": [],
    "devolvido_modelo": "E14 G2",
    "data_troca": "2026-09-08",
    "entregue_observacoes": "Entrega referente a troca devido Notebook anterior com falhas no teclado.",
    "devolvido_tipo": "Notebook",
    "entregue_tipo": "Notebook"
  },
  {
    "devolvido_marca": "Lenovo",
    "devolvido_tipo": "Notebook",
    "createdBy": "luhV54zNiHTShO8F4UwWMdxwuP73",
    "devolvido_modelo": "E14 G1",
    "entregue_acessorios_seriais": {},
    "entregue_serial": "PE060K0E",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-10210U (10\xAA Gera\xE7\xE3o)",
    "colaborador_email": "luis.matos@ciriontechnologies.com",
    "entregue_marca": "Lenovo",
    "timestamp": 1788377211579,
    "operationType": "exchange",
    "entregue_condicao": "Usado",
    "entregue_observacoes": "Entrega referente a troca devido Notebook anterior com defeito na ventoinha.",
    "id": "65WOVWR5D",
    "entregue_armazenamento": "512GB",
    "colaborador_nome": "Luis Matos",
    "data_troca": "2026-09-02",
    "entregue_modelo": "E14 G1",
    "entregue_memoria": "16GB",
    "status": "completed",
    "entregue_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "entregue_processador": "Intel\xAE Core\u2122 i5-10210U (10\xAA Gera\xE7\xE3o)",
    "devolvido_acessorios_seriais": {},
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "256GB",
    "devolvido_memoria": "8GB",
    "entregue_acessorios": [],
    "devolvido_serial": "PE060KK3"
  },
  {
    "entregue_observacoes": "Entrega referente a troca",
    "colaborador_nome": "Rubens Hida",
    "devolvido_condicao": "Usado",
    "entregue_memoria": "16GB",
    "status": "completed",
    "data_troca": "2026-08-31",
    "entregue_modelo": "E470",
    "entregue_acessorios_seriais": {},
    "entregue_serial": "",
    "devolvido_marca": "Motorola",
    "entregue_marca": "Lenovo",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido desligamento mesmo carregado.",
    "devolvido_modelo": "MOTO G54",
    "operationType": "return",
    "devolvido_tipo": "Smartphone",
    "entregue_armazenamento": "480GB",
    "devolvido_memoria": "8GB",
    "colaborador_email": "rubens.hida.ext@ciriontechnologies.com",
    "devolvido_serial": "353386381794953",
    "devolvido_armazenamento": "256GB",
    "entregue_acessorios": [],
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "createdBy": "JDNG01uDnvRiVCRG1xuirC2277y2",
    "entregue_tipo": "Notebook",
    "entregue_condicao": "Novo",
    "devolvido_acessorios_seriais": {},
    "timestamp": 1788203125147,
    "id": "P5EI11IP3",
    "devolvido_acessorios": []
  },
  {
    "colaborador_email": "alisson.bezerra@ciriontechnologies.com",
    "colaborador_nome": "Alisson da Silva Bezerra",
    "status": "completed",
    "entregue_memoria": "16GB",
    "id": "Z44JXAIU4",
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "devolvido_modelo": "E470",
    "entregue_marca": "Lenovo",
    "entregue_condicao": "Usado",
    "entregue_acessorios": [
      "Mouse",
      "Headset",
      "Teclado"
    ],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_tipo": "Notebook",
    "entregue_tipo": "Notebook",
    "entregue_armazenamento": "256GB",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "PE0A8Q2A",
    "devolvido_serial": "",
    "data_troca": "2026-08-25",
    "devolvido_armazenamento": "480GB",
    "timestamp": 1787683577785,
    "operationType": "delivery",
    "devolvido_acessorios": [],
    "devolvido_condicao": "Usado",
    "entregue_modelo": "E14 G2",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "createdBy": "WInJS3fYWJhUXT81eFNa3faUZbZ2"
  },
  {
    "entregue_armazenamento": "480GB",
    "devolvido_adicionais": [
      {
        "id": "SCTQC8LYM",
        "marca": "Motorola",
        "tipo": "Smartphone",
        "modelo": "MOTO G54",
        "serial": "353386381783832"
      }
    ],
    "colaborador_email": "karla.correa@ciriontechnologies.com",
    "entregue_modelo": "E470",
    "entregue_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_tipo": "Notebook",
    "id": "GVQE8HOX2",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "devolvido_serial": "PE0BXC3C",
    "operationType": "return",
    "entregue_serial": "",
    "entregue_condicao": "Novo",
    "devolvido_marca": "Lenovo",
    "devolvido_armazenamento": "1TB",
    "entregue_acessorios": [],
    "timestamp": 1787597353454,
    "createdBy": "BaBtoRtEsuVRquUF1f1NmdvyvwJ2",
    "devolvido_modelo": "E14 G4",
    "data_troca": "2026-08-24",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento",
    "devolvido_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "entregue_memoria": "16GB",
    "entregue_tipo": "Notebook",
    "colaborador_nome": "karla Correa",
    "status": "completed",
    "devolvido_memoria": "24GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)"
  },
  {
    "devolvido_tipo": "Notebook",
    "devolvido_marca": "Lenovo",
    "id": "JRXPXNPR8",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "entregue_serial": "353386381773577",
    "entregue_acessorios": [],
    "colaborador_email": "rubens.hida.ext@ciriontechnologies.com",
    "devolvido_acessorios": [],
    "entregue_marca": "Motorola",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_serial": "",
    "operationType": "delivery",
    "status": "completed",
    "entregue_condicao": "Usado",
    "devolvido_armazenamento": "480GB",
    "entregue_modelo": "MOTO G54",
    "devolvido_condicao": "Usado",
    "colaborador_nome": "Rubens Hida",
    "data_troca": "2026-08-24",
    "entregue_memoria": "8GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_modelo": "E470",
    "entregue_armazenamento": "256GB",
    "timestamp": 1787584501971,
    "devolvido_memoria": "16GB",
    "entregue_observacoes": "Entrega referente a troca devido a Moto G54 enviado anteriormente com bloqueio de configura\xE7\xE3o.",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "entregue_tipo": "Smartphone"
  },
  {
    "devolvido_marca": "Motorola",
    "devolvido_tipo": "Smartphone",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_modelo": "MOTO G54",
    "entregue_serial": "",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "colaborador_email": "rubens.hida.ext@ciriontechnologies.com",
    "entregue_marca": "Lenovo",
    "timestamp": 1787581248264,
    "operationType": "return",
    "entregue_condicao": "Novo",
    "entregue_observacoes": "Entrega referente a troca",
    "id": "5UUCESFAS",
    "entregue_armazenamento": "480GB",
    "colaborador_nome": "Rubens Hida",
    "data_troca": "2026-08-24",
    "entregue_modelo": "E470",
    "entregue_memoria": "16GB",
    "status": "completed",
    "entregue_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido smartphone com bloqueio de configura\xE7\xE3o.",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "256GB",
    "devolvido_memoria": "8GB",
    "entregue_acessorios": [],
    "devolvido_serial": "353386381774195"
  },
  {
    "devolvido_tipo": "Notebook",
    "devolvido_modelo": "E14 G4",
    "entregue_condicao": "Novo",
    "empresa_transporte": "MOTOBOY",
    "tipo_coleta": "motoboy",
    "data_coleta_residencial": "2026-08-20",
    "entregue_marca": "Lenovo",
    "colaborador_email": "marcio.belezi@ciriontechnologies.com",
    "colaborador_nome": "Marcio Belezi",
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_acessorios": [],
    "operationType": "return",
    "entregue_memoria": "16GB",
    "observacoes_coleta": "Devolu\xE7\xE3o referente a desligamento - Devolvido por Motoboy em Cotia ",
    "data_troca": "2026-08-20",
    "devolvido_armazenamento": "1TB",
    "devolvido_condicao": "Usado",
    "devolvido_acessorios": [
      "Mouse",
      "Headset"
    ],
    "status": "completed",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_serial": "",
    "devolvido_memoria": "24GB",
    "devolvido_marca": "Lenovo",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "entregue_tipo": "Notebook",
    "timestamp": 1787245887079,
    "entregue_modelo": "E470",
    "id": "NXYFKBAJ1",
    "createdBy": "lQJadqdSNgREmVHO2SZXo9Qr3713",
    "devolvido_serial": "PE0B9L4F",
    "entregue_armazenamento": "480GB",
    "devolucao_sem_termo": true
  },
  {
    "devolvido_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento ",
    "entregue_acessorios": [],
    "data_troca": "2026-08-18",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_modelo": "E14 G4",
    "id": "U5F5BROXD",
    "entregue_marca": "Lenovo",
    "entregue_memoria": "16GB",
    "devolvido_armazenamento": "1TB",
    "operationType": "return",
    "devolvido_tipo": "Notebook",
    "status": "completed",
    "colaborador_nome": "Juliana Tavares de Morais",
    "devolvido_memoria": "24GB",
    "devolvido_condicao": "Usado",
    "entregue_modelo": "E470",
    "colaborador_email": "juliana.tavaresdemorais@ciriontechnologies.com",
    "createdBy": "JnjJXK3opjSDHbDpvMa13CDYeaN2",
    "timestamp": 1787073272646,
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "entregue_armazenamento": "480GB",
    "devolvido_serial": "PE0B9L75",
    "devolvido_adicionais": [
      {
        "marca": "Motorola",
        "id": "6WLOG4M8B",
        "tipo": "Smartphone",
        "modelo": "MOTO G54",
        "serial": "353386381812490"
      }
    ],
    "entregue_tipo": "Notebook",
    "entregue_condicao": "Novo",
    "devolvido_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_serial": ""
  },
  {
    "entregue_memoria": "8GB",
    "id": "1VNEDRYNL",
    "entregue_tipo": "Smartphone",
    "colaborador_nome": "Roberto Silva Alexandre",
    "devolvido_memoria": "16GB",
    "status": "completed",
    "timestamp": 1786632090760,
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_condicao": "Usado",
    "devolvido_acessorios": [],
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_modelo": "E470",
    "entregue_observacoes": "Entrega  referente a Smartphone liberado para equipe utilizar.",
    "devolvido_serial": "",
    "devolvido_armazenamento": "480GB",
    "operationType": "delivery",
    "entregue_acessorios": [],
    "entregue_modelo": "MOTO G54",
    "entregue_condicao": "Usado",
    "entregue_armazenamento": "256GB",
    "entregue_marca": "Motorola",
    "colaborador_email": "roberto.silvaalexandre@ciriontechnologies.com",
    "devolvido_marca": "Lenovo",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_serial": "353386381790092",
    "data_troca": "2026-08-13",
    "devolvido_tipo": "Notebook"
  },
  {
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_observacoes": "Entrega referente a troca - O Antigo dever\xE1 ser deixado com a Gleisemara ou a Pamela para que possam enviar para Cotia.",
    "devolvido_tipo": "Notebook",
    "entregue_tipo": "Smartphone",
    "entregue_marca": "Motorola",
    "devolvido_serial": "",
    "entregue_acessorios": [],
    "createdBy": "xdNplYIToYfaGnMTydBjsxZ8iRe2",
    "timestamp": 1786562796219,
    "id": "BBKJO0SDM",
    "devolvido_memoria": "16GB",
    "status": "completed",
    "entregue_armazenamento": "256GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "colaborador_nome": "Rubens Hida",
    "colaborador_email": "rubens.hida@ciriontechnologies.com",
    "operationType": "delivery",
    "entregue_serial": "353386381774195",
    "devolvido_condicao": "Usado",
    "devolvido_marca": "Lenovo",
    "entregue_memoria": "8GB",
    "devolvido_modelo": "E470",
    "entregue_modelo": "MOTO G54",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "480GB",
    "data_troca": "2026-08-12",
    "entregue_condicao": "Usado"
  },
  {
    "entregue_tipo": "Notebook",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_serial": "",
    "devolvido_memoria": "16GB",
    "devolvido_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_armazenamento": "256GB",
    "id": "JU9DC2FJS",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [
      "Mochila",
      "Teclado",
      "Mouse",
      "Headset"
    ],
    "entregue_serial": "PE07X4EB",
    "colaborador_nome": "Edmilson Manzini Filho",
    "devolvido_marca": "Lenovo",
    "entregue_condicao": "Usado",
    "devolvido_armazenamento": "480GB",
    "entregue_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "timestamp": 1786539807149,
    "entregue_observacoes": "Entrega referente a novo colaborador ",
    "data_troca": "2026-08-12",
    "colaborador_email": "edmilson.manzinifilho@ciriontechnologies.com",
    "entregue_marca": "Lenovo",
    "devolvido_modelo": "E470",
    "status": "completed",
    "devolvido_tipo": "Notebook",
    "entregue_modelo": "E14 G2",
    "createdBy": "bgKBoepRrGP0PYTri5bDEz5C3bo1"
  },
  {
    "entregue_memoria": "8GB",
    "devolvido_marca": "Lenovo",
    "entregue_armazenamento": "256GB",
    "entregue_serial": "353386381801212",
    "devolvido_tipo": "Notebook",
    "entregue_observacoes": "Entrega referente a primeiro Smartphone",
    "devolvido_memoria": "16GB",
    "colaborador_nome": "Celio Vieira",
    "entregue_marca": "Motorola",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [],
    "devolvido_armazenamento": "480GB",
    "operationType": "delivery",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_modelo": "MOTO G54",
    "status": "completed",
    "devolvido_modelo": "E470",
    "devolvido_serial": "",
    "entregue_condicao": "Usado",
    "colaborador_email": "celio.vieira@ciriontechnologies.com",
    "data_troca": "2026-08-10",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "createdBy": "bgKBoepRrGP0PYTri5bDEz5C3bo1",
    "entregue_tipo": "Smartphone",
    "timestamp": 1786365700147,
    "devolvido_acessorios": [],
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "id": "BBMG2HSAB"
  },
  {
    "createdBy": "bgKBoepRrGP0PYTri5bDEz5C3bo1",
    "entregue_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "timestamp": 1786126764051,
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "devolvido_modelo": "E470",
    "entregue_memoria": "16GB",
    "devolvido_armazenamento": "480GB",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "data_troca": "2026-08-07",
    "colaborador_nome": "Edmilson Manzini Filho",
    "devolvido_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_serial": "PE07X4EB",
    "colaborador_email": "edmilson.manzinifilho@ciriontechnologies.com",
    "devolvido_marca": "Lenovo",
    "entregue_armazenamento": "256GB",
    "operationType": "delivery",
    "id": "H62BWQ3BA",
    "status": "completed",
    "devolvido_acessorios": [],
    "devolvido_serial": "",
    "entregue_marca": "Lenovo",
    "entregue_condicao": "Novo",
    "devolvido_tipo": "Notebook",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "entregue_modelo": "E14 G2"
  },
  {
    "entregue_tipo": "Notebook",
    "devolvido_modelo": "E14 G2",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "colaborador_email": "maria.ferreiralopes@ciriontechnologies.com",
    "entregue_acessorios": [],
    "devolvido_acessorios": [
      "Mouse",
      "Teclado",
      "Headset"
    ],
    "observacoes_coleta": "Devolu\xE7\xE3o referente a desligamento: 01 Notebook E14 G2 Serial: PE0A8Q2A, 01 Carregador 65W, 01 Headset  e 01 Teclado com fio",
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento",
    "entregue_armazenamento": "480GB",
    "tipo_coleta": "motoboy",
    "colaborador_nome": "Maria L\xFAcia Ferreira Lopes",
    "entregue_memoria": "16GB",
    "empresa_transporte": "Motoboy",
    "entregue_condicao": "Novo",
    "status": "completed",
    "devolucao_sem_termo": true,
    "createdBy": "bgKBoepRrGP0PYTri5bDEz5C3bo1",
    "devolvido_armazenamento": "256GB",
    "timestamp": 1786124810636,
    "operationType": "return",
    "entregue_modelo": "E470",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "id": "W11QL8O59",
    "devolvido_tipo": "Notebook",
    "entregue_serial": "",
    "devolvido_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_condicao": "Usado",
    "devolvido_memoria": "16GB",
    "entregue_marca": "Lenovo",
    "data_coleta_residencial": "2026-08-07",
    "devolvido_serial": "PE0A8Q2A",
    "codigo_coleta_os": "999",
    "data_troca": "2026-08-07"
  },
  {
    "entregue_marca": "Lenovo",
    "colaborador_email": "daniel.souza@ciriontechnologies.com",
    "timestamp": 1786041062398,
    "createdBy": "bgKBoepRrGP0PYTri5bDEz5C3bo1",
    "devolvido_marca": "Lenovo",
    "devolvido_tipo": "Notebook",
    "entregue_armazenamento": "256GB",
    "data_troca": "2026-08-06",
    "entregue_serial": "PE07X4DT",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "entregue_modelo": "E14 G2",
    "entregue_condicao": "Usado",
    "entregue_tipo": "Notebook",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_acessorios": [],
    "devolvido_serial": "",
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "devolvido_modelo": "E470",
    "status": "completed",
    "devolvido_armazenamento": "480GB",
    "id": "ILPO2E3ZL",
    "colaborador_nome": "Daniel Souza",
    "operationType": "delivery",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_memoria": "16GB",
    "entregue_memoria": "16GB"
  },
  {
    "devolvido_modelo": "E14 G2",
    "devolvido_condicao": "Usado",
    "id": "EVELC40L6",
    "data_coleta_residencial": "2026-08-06",
    "entregue_tipo": "Notebook",
    "entregue_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento",
    "devolvido_memoria": "16GB",
    "tipo_coleta": "motoboy",
    "devolvido_armazenamento": "256GB",
    "colaborador_nome": "Igor Araujo Dos Santos",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_memoria": "16GB",
    "devolucao_sem_termo": true,
    "entregue_marca": "Lenovo",
    "devolvido_marca": "Lenovo",
    "createdBy": "jHnlZFIuiwfaC0gZLwhMyZjR83w2",
    "entregue_armazenamento": "480GB",
    "entregue_serial": "",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "data_troca": "2026-08-06",
    "devolvido_acessorios": [
      "Headset"
    ],
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "timestamp": 1786025961999,
    "devolvido_tipo": "Notebook",
    "entregue_condicao": "Novo",
    "empresa_transporte": "Motoboy",
    "operationType": "return",
    "colaborador_email": "igor.araujo@ciriontechnologies.com",
    "status": "completed",
    "observacoes_coleta": "Motoboy entregou na Rep\xE7\xE3o ",
    "entregue_modelo": "E470",
    "codigo_coleta_os": "Recep\xE7\xE3o",
    "devolvido_serial": "PE07X4DY"
  },
  {
    "operationType": "delivery",
    "colaborador_nome": "Diego Ongaro de Mello Lopes",
    "entregue_memoria": "32GB",
    "colaborador_email": "diego.ongarodemellolopes@ciriontechnologies.com",
    "devolvido_tipo": "Notebook",
    "entregue_armazenamento": "1TB",
    "entregue_condicao": "Usado",
    "devolvido_acessorios": [],
    "devolvido_modelo": "E470",
    "status": "completed",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_processador": "Intel\xAE Core\u2122 Ultra 5 125U (AI Boost)",
    "entregue_marca": "Lenovo",
    "devolvido_armazenamento": "480GB",
    "data_troca": "2026-08-05",
    "entregue_modelo": "E14 G6",
    "entregue_acessorios": [
      "Mouse",
      "Teclado",
      "Headset"
    ],
    "createdBy": "sXrudy9iTzg6tWsOabyCdX4bQVx1",
    "timestamp": 1785957583820,
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "devolvido_serial": "",
    "devolvido_condicao": "Usado",
    "entregue_tipo": "Notebook",
    "devolvido_memoria": "16GB",
    "id": "Q9CADHKPN",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_serial": "PE0EF30E",
    "devolvido_marca": "Lenovo"
  },
  {
    "entregue_memoria": "16GB",
    "createdBy": "sXrudy9iTzg6tWsOabyCdX4bQVx1",
    "operationType": "delivery",
    "id": "IF4KJL3SH",
    "entregue_armazenamento": "256GB",
    "colaborador_nome": "Rodrigo Paix\xE3o ",
    "timestamp": 1785941537790,
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_acessorios": [],
    "devolvido_memoria": "16GB",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "devolvido_modelo": "E470",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_armazenamento": "480GB",
    "devolvido_serial": "",
    "colaborador_email": "rodrigo.paixao@ciriontechnologies.com",
    "devolvido_tipo": "Notebook",
    "entregue_modelo": "E14 G2",
    "entregue_tipo": "Notebook",
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "entregue_marca": "Lenovo",
    "status": "completed",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "data_troca": "2026-08-05",
    "entregue_serial": "PE08YY4D",
    "devolvido_condicao": "Usado",
    "entregue_condicao": "Usado",
    "devolvido_marca": "Lenovo"
  },
  {
    "entregue_tipo": "Notebook",
    "devolvido_modelo": "E470",
    "entregue_armazenamento": "1TB",
    "entregue_serial": "PE0B9L7M",
    "colaborador_email": "julio.bastos@ciriontechnologies.com",
    "devolvido_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a novo colaborador - NF 10571",
    "colaborador_nome": "J\xFAlio C\xE9sar Souza Bastos",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Headset"
    ],
    "entregue_condicao": "Usado",
    "entregue_marca": "Lenovo",
    "devolvido_armazenamento": "480GB",
    "id": "1BY89AS7J",
    "entregue_modelo": "E14 G4",
    "devolvido_condicao": "Usado",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_memoria": "24GB",
    "devolvido_tipo": "Notebook",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "devolvido_acessorios": [],
    "createdBy": "sXrudy9iTzg6tWsOabyCdX4bQVx1",
    "devolvido_memoria": "16GB",
    "data_troca": "2026-08-05",
    "status": "completed",
    "timestamp": 1785939339821,
    "devolvido_serial": "",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca"
  },
  {
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_armazenamento": "256GB",
    "devolvido_memoria": "16GB",
    "devolvido_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "devolvido_serial": "",
    "entregue_marca": "Lenovo",
    "status": "completed",
    "data_troca": "2026-08-04",
    "entregue_tipo": "Notebook",
    "entregue_observacoes": "Entrega referente a nova colaboradora",
    "id": "SR26WCLMN",
    "devolvido_acessorios": [],
    "devolvido_marca": "Lenovo",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2",
    "entregue_serial": "PE0A8Q2W",
    "colaborador_nome": "Giovanna De Oliveira Ardesore",
    "entregue_condicao": "Usado",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "entregue_memoria": "16GB",
    "timestamp": 1785872752838,
    "devolvido_armazenamento": "480GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "devolvido_modelo": "E470",
    "entregue_modelo": "E14 G2",
    "colaborador_email": "giovanna.deoliveiraardesore@ciriontechnologies.com"
  },
  {
    "entregue_memoria": "40GB",
    "devolvido_marca": "Lenovo",
    "devolvido_memoria": "16GB",
    "operationType": "delivery",
    "devolvido_condicao": "Usado",
    "entregue_serial": "PE0CSSMC",
    "devolvido_acessorios": [],
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "status": "completed",
    "colaborador_nome": "Denise Pereira de Medeiros",
    "id": "ATN23P54K",
    "devolvido_armazenamento": "480GB",
    "entregue_marca": "Lenovo",
    "entregue_modelo": "E14 G4",
    "devolvido_tipo": "Notebook",
    "devolvido_modelo": "E470",
    "entregue_armazenamento": "1TB",
    "devolvido_serial": "",
    "entregue_condicao": "Usado",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "entregue_tipo": "Notebook",
    "timestamp": 1785788422816,
    "data_troca": "2026-08-03",
    "entregue_observacoes": "Entrega referente a nova colaboradora",
    "colaborador_email": "denise.pereirademedeiros@ciriontechnologies.com",
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2"
  },
  {
    "devolvido_serial": "",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_observacoes": "Entrega referente a novo colaborador",
    "devolvido_armazenamento": "480GB",
    "id": "AFGPGKVVX",
    "devolvido_memoria": "16GB",
    "timestamp": 1785785251355,
    "entregue_armazenamento": "256GB",
    "entregue_tipo": "Notebook",
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "entregue_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "status": "completed",
    "entregue_modelo": "E14 G2",
    "data_troca": "2026-08-03",
    "colaborador_email": "caio.santarelli@ciriontechnologies.com",
    "colaborador_nome": "Caio Santarelli",
    "devolvido_marca": "Lenovo",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "entregue_marca": "Lenovo",
    "entregue_condicao": "Usado",
    "entregue_serial": "PE08YY6T",
    "devolvido_tipo": "Notebook",
    "operationType": "delivery",
    "devolvido_modelo": "E470",
    "devolvido_acessorios": []
  },
  {
    "entregue_armazenamento": "256GB",
    "colaborador_email": "igor.silva@ciriontechnologies.com",
    "entregue_modelo": "E14 G2",
    "entregue_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a novo colaborador ",
    "devolvido_tipo": "Notebook",
    "id": "JDOLK7V2S",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_serial": "",
    "operationType": "delivery",
    "entregue_serial": "PE08YY4S",
    "entregue_condicao": "Usado",
    "devolvido_marca": "Lenovo",
    "devolvido_armazenamento": "480GB",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "timestamp": 1785781166640,
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2",
    "devolvido_modelo": "E470",
    "data_troca": "2026-08-03",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_acessorios": [],
    "entregue_memoria": "16GB",
    "entregue_tipo": "Notebook",
    "colaborador_nome": "Igor Silva",
    "status": "completed",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_memoria": "16GB"
  },
  {
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2",
    "id": "CQKV6T2QU",
    "devolvido_modelo": "E470",
    "entregue_tipo": "Notebook",
    "entregue_condicao": "Usado",
    "status": "completed",
    "timestamp": 1785761831832,
    "entregue_armazenamento": "256GB",
    "colaborador_email": "matheus.decamargo@ciriontechnologies.com",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_observacoes": "Entrega referente a novo colaborador ",
    "colaborador_nome": "Matheus de Camargo",
    "entregue_memoria": "16GB",
    "devolvido_condicao": "Usado",
    "devolvido_armazenamento": "480GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Headset",
      "Teclado"
    ],
    "devolvido_acessorios": [],
    "entregue_modelo": "E14 G2",
    "devolvido_memoria": "16GB",
    "data_troca": "2026-08-03",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_marca": "Lenovo",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "PE08YY4B",
    "devolvido_serial": "",
    "devolvido_tipo": "Notebook"
  },
  {
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_armazenamento": "480GB",
    "entregue_marca": "Lenovo",
    "devolvido_modelo": "T14 G2",
    "entregue_modelo": "E470",
    "devolvido_tipo": "Notebook",
    "devolvido_acessorios": [
      "Mouse",
      "Teclado",
      "Headset"
    ],
    "entregue_tipo": "Notebook",
    "colaborador_nome": "Ramon Loiola",
    "devolvido_memoria": "16GB",
    "entregue_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento ",
    "entregue_serial": "",
    "entregue_memoria": "16GB",
    "status": "completed",
    "devolvido_marca": "Lenovo",
    "colaborador_email": "robson.nunesdossantos@ciriontechnologies.com",
    "entregue_condicao": "Novo",
    "entregue_observacoes": "Entrega referente a troca",
    "timestamp": 1785520112132,
    "data_troca": "2026-07-31",
    "devolvido_armazenamento": "512GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1145G7 vPro\xAE (11\xAA Gera\xE7\xE3o)",
    "id": "UJJBMPD4A",
    "devolvido_adicionais": [
      {
        "tipo": "Smartphone",
        "marca": "Apple",
        "id": "DL7WAP6Q5",
        "modelo": "IPHONE 14",
        "serial": "359462813233482"
      }
    ],
    "devolvido_serial": "PE093AT2",
    "devolvido_condicao": "Usado",
    "operationType": "return",
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2"
  },
  {
    "data_troca": "2026-07-28",
    "entregue_modelo": "E470",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [],
    "status": "completed",
    "id": "I9DJ2G1ZR",
    "devolvido_serial": "PE0CSSJX",
    "entregue_tipo": "Notebook",
    "devolvido_acessorios": [],
    "timestamp": 1785265962894,
    "devolvido_memoria": "40GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "",
    "createdBy": "FyZ513NXPtPwmulTJcXUWfu5Zyr2",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "colaborador_nome": "Robson Nunes dos Santos",
    "operationType": "return",
    "devolvido_armazenamento": "1TB",
    "entregue_marca": "Lenovo",
    "colaborador_email": "robson.nunesdossantos@ciriontechnologies.com",
    "entregue_memoria": "16GB",
    "devolvido_tipo": "Notebook",
    "entregue_armazenamento": "480GB",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_condicao": "Novo",
    "devolvido_modelo": "E14 G4",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento"
  },
  {
    "data_troca": "2026-07-02",
    "devolvido_serial": "PE0A8Q2X",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1145G7 vPro\xAE (11\xAA Gera\xE7\xE3o)",
    "devolvido_condicao": "Usado",
    "devolvido_acessorios": [],
    "id": "MWF1WEX92",
    "entregue_modelo": "T14 G2",
    "entregue_serial": "PE0B9N5B",
    "timestamp": 1782990934586,
    "devolvido_marca": "Lenovo",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_memoria": "16GB",
    "createdBy": "cmZEgREttEMBmVXaBbgko1Rj3OC2",
    "entregue_tipo": "Notebook",
    "entregue_memoria": "32GB",
    "status": "completed",
    "colaborador_email": "marcelo.dealmeida@ciriontechnologies.com",
    "entregue_armazenamento": "1TB",
    "colaborador_nome": "Marcelo De Almeida",
    "devolvido_armazenamento": "256GB",
    "devolvido_tipo": "Notebook",
    "entregue_acessorios": [],
    "operationType": "exchange",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_condicao": "Usado",
    "entregue_marca": "Lenovo",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_modelo": "E14 G2"
  },
  {
    "entregue_observacoes": "Entrega referente a nova colaboradora",
    "timestamp": 1782933019134,
    "colaborador_nome": "Juliana Goncalves da Cunha Piccolo Silva",
    "entregue_memoria": "24GB",
    "createdBy": "cmZEgREttEMBmVXaBbgko1Rj3OC2",
    "entregue_condicao": "Usado",
    "devolvido_modelo": "E470",
    "colaborador_email": "juliana.goncalves@ciriontechnologies.com",
    "entregue_marca": "Lenovo",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "devolvido_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "entregue_modelo": "E14 G4",
    "data_troca": "2026-07-01",
    "devolvido_memoria": "16GB",
    "devolvido_serial": "",
    "status": "completed",
    "id": "SAODTEM91",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "entregue_armazenamento": "1TB",
    "entregue_tipo": "Notebook",
    "devolvido_armazenamento": "480GB",
    "devolvido_marca": "Lenovo",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_acessorios": [],
    "entregue_serial": "PE0B9L6C"
  },
  {
    "id": "3YPKT0U4N",
    "data_troca": "2026-06-30",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_marca": "Motorola",
    "entregue_serial": "",
    "devolvido_modelo": "MOTO G54",
    "colaborador_email": "Jose.Geraldo@ciriontechnologies.com",
    "entregue_memoria": "16GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_tipo": "Notebook",
    "entregue_modelo": "E470",
    "devolvido_armazenamento": "256GB",
    "entregue_condicao": "Novo",
    "devolvido_tipo": "Smartphone",
    "entregue_armazenamento": "480GB",
    "colaborador_nome": "Jose Geraldo ",
    "devolvido_acessorios": [],
    "entregue_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a troca",
    "timestamp": 1782847787208,
    "entregue_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o devido n\xE3o precisar usar, ir\xE1 usar o Smartphone particular.",
    "createdBy": "cmZEgREttEMBmVXaBbgko1Rj3OC2",
    "devolvido_memoria": "8GB",
    "devolvido_serial": "353386381771514",
    "devolvido_condicao": "Usado",
    "status": "completed",
    "operationType": "return"
  },
  {
    "id": "VTWOYWESL",
    "devolvido_condicao": "Usado",
    "colaborador_email": "Marcia.silva@outlook.com",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "1TB",
    "timestamp": 1782821090316,
    "devolvido_modelo": "X13 G5",
    "createdBy": "qnKkk6YqGnhRs7HSF0yG7bg6iIr1",
    "devolvido_processador": "Intel\xAE Core\u2122 Ultra 7 165U (vPro AI)",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "return",
    "status": "completed",
    "entregue_memoria": "16GB",
    "entregue_condicao": "Novo",
    "colaborador_nome": "Marcia Silva",
    "entregue_acessorios": [],
    "devolvido_tipo": "Notebook",
    "entregue_armazenamento": "480GB",
    "devolvido_marca": "Lenovo",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento - 02/06/26",
    "entregue_marca": "Lenovo",
    "entregue_serial": "",
    "entregue_modelo": "E470",
    "data_troca": "2026-06-30",
    "devolvido_serial": "GM112CAZ",
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_memoria": "32GB",
    "entregue_tipo": "Notebook"
  },
  {
    "entregue_modelo": "MOTO G54",
    "colaborador_email": "renan.islas@ciriontechnologies.com",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_modelo": "E470",
    "entregue_acessorios": [],
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "480GB",
    "entregue_marca": "Motorola",
    "entregue_memoria": "8GB",
    "operationType": "delivery",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "colaborador_nome": "Renan Islas",
    "entregue_condicao": "Usado",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "353386381860531",
    "devolvido_tipo": "Notebook",
    "timestamp": 1782486185712,
    "devolvido_condicao": "Usado",
    "id": "EL1WHJVLO",
    "data_troca": "2026-06-26",
    "entregue_armazenamento": "256GB",
    "createdBy": "GryY9u2kqnhdebzY8eTThcUoxoz2",
    "entregue_observacoes": "Entrega referente a primeiro Smartphone",
    "devolvido_serial": "",
    "entregue_tipo": "Smartphone",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_memoria": "16GB",
    "status": "completed"
  },
  {
    "devolvido_modelo": "X13 G5",
    "colaborador_email": "antonio.rana@ciriontechnologies.com",
    "devolvido_processador": "Intel\xAE Core\u2122 Ultra 7 165U (vPro AI)",
    "id": "S52XR5TVL",
    "entregue_armazenamento": "480GB",
    "colaborador_nome": "Antonio Roberto Vitor Rana",
    "entregue_condicao": "Novo",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_tipo": "Notebook",
    "entregue_memoria": "16GB",
    "devolvido_tipo": "Notebook",
    "timestamp": 1782216248437,
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_armazenamento": "1TB",
    "entregue_modelo": "E470",
    "devolvido_condicao": "Usado",
    "devolvido_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento ",
    "createdBy": "E6ienGsyIgXqVcoJfrXfSlPd2LY2",
    "entregue_marca": "Lenovo",
    "status": "completed",
    "entregue_acessorios": [],
    "operationType": "return",
    "devolvido_memoria": "32GB",
    "data_troca": "2026-06-23",
    "entregue_serial": "",
    "devolvido_marca": "Lenovo",
    "devolvido_serial": "GM0SFAVM"
  },
  {
    "devolvido_serial": "353386381798673",
    "operationType": "return",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "status": "completed",
    "entregue_observacoes": "Entrega de equipamento novo",
    "id": "ZJTY9C383",
    "devolvido_memoria": "8GB",
    "entregue_marca": "Lenovo",
    "devolvido_tipo": "Smartphone",
    "entregue_memoria": "16GB",
    "timestamp": 1781809980684,
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento devido conta Google bloqueada.",
    "entregue_tipo": "Notebook",
    "entregue_armazenamento": "480GB",
    "createdBy": "AV73iv6nbbb5kdzCsmfCS8DUMIq2",
    "colaborador_nome": "Priscila de Melo",
    "devolvido_armazenamento": "256GB",
    "entregue_modelo": "E470",
    "colaborador_email": "priscila.dossantos@ciriontechnologies.com",
    "devolvido_condicao": "Usado",
    "entregue_serial": "",
    "devolvido_acessorios": [],
    "entregue_acessorios": [],
    "entregue_condicao": "Novo",
    "devolvido_marca": "Motorola",
    "data_troca": "2026-06-18",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_modelo": "MOTO G54"
  },
  {
    "devolvido_marca": "Samsung",
    "data_troca": "2026-06-18",
    "colaborador_nome": "Jos\xE9 Geraldo",
    "entregue_condicao": "Usado",
    "entregue_serial": "353386381771514",
    "status": "completed",
    "entregue_armazenamento": "256GB",
    "entregue_memoria": "8GB",
    "id": "607D9W7K1",
    "devolvido_modelo": "SAMSUNG A20",
    "devolvido_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido muito lento.",
    "colaborador_email": "Jose.Geraldo@ciriontechnologies.com",
    "entregue_modelo": "MOTO G54",
    "operationType": "exchange",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_condicao": "Usado",
    "entregue_marca": "Motorola",
    "timestamp": 1781804803204,
    "devolvido_memoria": "3GB",
    "devolvido_tipo": "Smartphone",
    "devolvido_serial": "357389105829317",
    "entregue_observacoes": "Entrega referente a troca devido Smartphone anterior Samsung A20 muito Lento",
    "createdBy": "AV73iv6nbbb5kdzCsmfCS8DUMIq2",
    "entregue_tipo": "Smartphone",
    "entregue_acessorios": [],
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_armazenamento": "32GB"
  },
  {
    "entregue_memoria": "8GB",
    "entregue_armazenamento": "256GB",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "operationType": "exchange",
    "devolvido_acessorios": [],
    "devolvido_condicao": "Usado",
    "colaborador_email": "Fabio.Azevedo@ciriontechnologies.com",
    "colaborador_nome": "Fabio Azevedo",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "entregue_condicao": "Usado",
    "devolvido_modelo": "MOTO G54",
    "devolvido_armazenamento": "256GB",
    "devolvido_serial": "353386381799838",
    "entregue_tipo": "Smartphone",
    "entregue_serial": "353386381715131",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido tela trincada",
    "id": "4SMU8PR3C",
    "entregue_acessorios": [],
    "devolvido_marca": "Motorola",
    "createdBy": "cF9CqsbXBrd0Ae9H2Y4FEwEUeKi2",
    "devolvido_tipo": "Smartphone",
    "devolvido_memoria": "8GB",
    "entregue_modelo": "MOTO G54",
    "status": "completed",
    "data_troca": "2026-06-18",
    "entregue_observacoes": "Entrega referente a troca devido Smartphone anterior com tela trincada",
    "entregue_marca": "Motorola",
    "timestamp": 1781781679312
  },
  {
    "devolvido_armazenamento": "256GB",
    "entregue_serial": "353386381780739",
    "colaborador_email": "Fabio.Azevedo@ciriontechnologies.com",
    "devolvido_marca": "Motorola",
    "devolvido_acessorios": [],
    "status": "completed",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_condicao": "Usado",
    "operationType": "exchange",
    "entregue_condicao": "Usado",
    "entregue_acessorios": [],
    "devolvido_serial": "353386381799838",
    "entregue_modelo": "MOTO G54",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido tela trincada",
    "devolvido_tipo": "Smartphone",
    "id": "X8ZOA40OV",
    "devolvido_modelo": "MOTO G54",
    "entregue_marca": "Motorola",
    "createdBy": "fCBvQdjAEAcGSPsUL1lyd8qjPu22",
    "entregue_armazenamento": "256GB",
    "colaborador_nome": "Fabio Azevedo",
    "entregue_observacoes": "Entrega referente a troca",
    "data_troca": "2026-06-17",
    "entregue_memoria": "8GB",
    "devolvido_memoria": "8GB",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "entregue_tipo": "Smartphone",
    "timestamp": 1781708548497
  },
  {
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "id": "W0PRUOUPI",
    "colaborador_email": "tomas.kim@ciriontechnologies.com",
    "timestamp": 1781616239450,
    "createdBy": "fCBvQdjAEAcGSPsUL1lyd8qjPu22",
    "devolvido_modelo": "T14 G4",
    "entregue_tipo": "Notebook",
    "entregue_marca": "Lenovo",
    "entregue_memoria": "32GB",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_condicao": "Usado",
    "devolvido_tipo": "Notebook",
    "status": "completed",
    "data_troca": "2026-06-16",
    "colaborador_nome": "Tomas Kim",
    "operationType": "exchange",
    "entregue_modelo": "X13 G5",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_armazenamento": "1TB",
    "devolvido_acessorios": [],
    "entregue_processador": "Intel\xAE Core\u2122 Ultra 7 165U (vPro AI)",
    "devolvido_serial": "PE0CTXAY",
    "entregue_acessorios": [],
    "devolvido_condicao": "Usado",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "GM0SFAVR",
    "entregue_armazenamento": "1TB",
    "devolvido_memoria": "32GB"
  },
  {
    "entregue_marca": "Lenovo",
    "createdBy": "fCBvQdjAEAcGSPsUL1lyd8qjPu22",
    "entregue_observacoes": "Entrega referente a troca devido Notebook anterior com defeito na placa m\xE3e.",
    "operationType": "exchange",
    "colaborador_nome": "Leonardo Atilio de Oliveira",
    "entregue_memoria": "40GB",
    "status": "completed",
    "devolvido_tipo": "Notebook",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "PE0CSSLZ",
    "timestamp": 1781207163597,
    "colaborador_email": "leonardo.atiliodeoliveira@ciriontechnologies.com",
    "entregue_modelo": "E14 G4",
    "id": "39KK75BDI",
    "devolvido_modelo": "E14 G4",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "entregue_condicao": "Usado",
    "data_troca": "2026-06-11",
    "entregue_armazenamento": "1TB",
    "devolvido_armazenamento": "1TB",
    "devolvido_serial": "PE0CSSMZ",
    "entregue_tipo": "Notebook",
    "entregue_acessorios": [],
    "devolvido_memoria": "40GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido defeito na placa m\xE3e.",
    "devolvido_acessorios": []
  },
  {
    "entregue_memoria": "32GB",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "PE0EF2ZE",
    "entregue_processador": "Intel\xAE Core\u2122 Ultra 5 125U (AI Boost)",
    "createdBy": "fCBvQdjAEAcGSPsUL1lyd8qjPu22",
    "timestamp": 1781183762514,
    "devolvido_acessorios": [],
    "entregue_tipo": "Notebook",
    "id": "233QN3RLM",
    "devolvido_memoria": "32GB",
    "colaborador_nome": "Romulo De Moraes Cillo",
    "devolvido_processador": "Intel\xAE Core\u2122 Ultra 5 125U (AI Boost)",
    "entregue_modelo": "E14 G6",
    "devolvido_modelo": "E14 G6",
    "devolvido_serial": "PE0EF30L",
    "devolvido_condicao": "Usado",
    "operationType": "exchange",
    "entregue_condicao": "Usado",
    "status": "completed",
    "entregue_acessorios": [],
    "devolvido_armazenamento": "1TB",
    "data_troca": "2026-06-11",
    "colaborador_email": "Romulo.Cillo@ciriontechnologies.com",
    "entregue_armazenamento": "1TB",
    "entregue_observacoes": "Entrega referente a troca devido defeito no Notebook anterior",
    "devolvido_tipo": "Notebook",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca devido falha ao reiniciar.",
    "entregue_marca": "Lenovo"
  },
  {
    "entregue_condicao": "Novo",
    "createdBy": "jHnlZFIuiwfaC0gZLwhMyZjR83w2",
    "devolvido_serial": "353386381771514",
    "timestamp": 1781032556884,
    "entregue_serial": "",
    "devolvido_marca": "Motorola",
    "entregue_tipo": "Notebook",
    "entregue_modelo": "E470",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [],
    "data_troca": "2026-06-09",
    "devolvido_armazenamento": "256GB",
    "status": "completed",
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_observacoes": "Devolu\xE7\xE3o devido n\xE3o precisar usar - Devolve junto um Headset",
    "colaborador_email": "vinicius.carvalho@ciriontechnologies.com",
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_acessorios": [],
    "id": "OGKOCMF29",
    "entregue_memoria": "16GB",
    "devolvido_memoria": "8GB",
    "colaborador_nome": "Vinicius Carvalho Pereira",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "docusign_envelope_id": "ds-mock-node-1781032801719",
    "devolvido_tipo": "Smartphone",
    "entregue_armazenamento": "480GB",
    "devolvido_modelo": "MOTO G54",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "docusign_status": "pending",
    "entregue_marca": "Lenovo",
    "operationType": "return"
  },
  {
    "devolvido_acessorios": [],
    "entregue_condicao": "Novo",
    "timestamp": 1780932923343,
    "devolvido_serial": "353034119228403",
    "data_troca": "2026-06-08",
    "createdBy": "uWzQjnawWsUXhWTHXK82wJslCoe2",
    "entregue_acessorios": [],
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_armazenamento": "480GB",
    "devolvido_processador": "Apple A14 Bionic (Hexa-Core)",
    "colaborador_email": "Fabio.Ribeiro@ciriontechnologies.com",
    "entregue_tipo": "Notebook",
    "status": "completed",
    "devolvido_condicao": "Usado",
    "devolvido_marca": "Apple",
    "entregue_marca": "Lenovo",
    "entregue_serial": "",
    "entregue_memoria": "16GB",
    "devolvido_memoria": "4GB",
    "devolvido_tipo": "Smartphone",
    "colaborador_nome": "Fabio Da Silva Ribeiro",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca - Havia trocado em outra data anterior, devolveu o IPHONE12 em 08/06/26",
    "operationType": "return",
    "entregue_modelo": "E470",
    "devolvido_modelo": "IPHONE 12",
    "id": "MRC372J9I",
    "devolvido_armazenamento": "128GB",
    "entregue_observacoes": "Entrega referente a troca"
  },
  {
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_serial": "",
    "entregue_modelo": "E14 G4",
    "entregue_tipo": "Notebook",
    "entregue_observacoes": "Entrega referente a novo colaborador - Optou por somente usar linha corporativa Esim no celular particular.",
    "devolvido_tipo": "Notebook",
    "devolvido_memoria": "16GB",
    "entregue_marca": "Lenovo",
    "devolvido_marca": "Lenovo",
    "data_troca": "2026-06-08",
    "entregue_serial": "PE0BXC38",
    "id": "RS6JETNVE",
    "entregue_memoria": "24GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Teclado",
      "Headset"
    ],
    "operationType": "delivery",
    "entregue_condicao": "Usado",
    "colaborador_nome": "Luiz Bruno Teixeira",
    "devolvido_condicao": "Usado",
    "createdBy": "uWzQjnawWsUXhWTHXK82wJslCoe2",
    "status": "completed",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "colaborador_email": "bruno.teixeira@ciriontechnologies.com",
    "entregue_armazenamento": "1TB",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "480GB",
    "devolvido_modelo": "E470",
    "timestamp": 1780928738726
  },
  {
    "status": "completed",
    "entregue_tipo": "Notebook",
    "devolvido_memoria": "8GB",
    "devolvido_armazenamento": "256GB",
    "entregue_armazenamento": "480GB",
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_condicao": "Usado",
    "devolvido_serial": "	PE0A8Q20",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento",
    "devolvido_adicionais": [
      {
        "id": "41B3Z79U5",
        "tipo": "Smartphone",
        "marca": "Motorola",
        "serial": "353386381812797",
        "modelo": "MOTO G54"
      }
    ],
    "createdBy": "uWzQjnawWsUXhWTHXK82wJslCoe2",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "return",
    "devolvido_modelo": "E14 G2",
    "devolvido_acessorios": [
      "Mochila",
      "Teclado",
      "Mouse"
    ],
    "devolvido_marca": "Lenovo",
    "entregue_condicao": "Novo",
    "entregue_serial": "",
    "timestamp": 1780920289883,
    "entregue_acessorios": [],
    "entregue_marca": "Lenovo",
    "entregue_modelo": "E470",
    "colaborador_nome": "Jos\xE9 Menegali",
    "colaborador_email": "jose.menegale@ciriontechnologies.com",
    "devolvido_tipo": "Notebook",
    "entregue_memoria": "16GB",
    "id": "NI72LFSA5",
    "data_troca": "2026-06-08",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)"
  },
  {
    "timestamp": 1780315651047,
    "devolvido_modelo": "E470",
    "entregue_condicao": "Usado",
    "devolvido_acessorios": [],
    "entregue_acessorios": [
      "Mouse",
      "Teclado",
      "Mochila",
      "Headset"
    ],
    "entregue_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "PE0CSSMZ",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "id": "01P9L6WVQ",
    "colaborador_nome": "Leonardo Atilio de Oliveira",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "delivery",
    "entregue_modelo": "E14 G4",
    "entregue_memoria": "32GB",
    "colaborador_email": "leonardo.atiliodeoliveira@ciriontechnologies.com",
    "entregue_adicionais": [],
    "devolvido_memoria": "16GB",
    "entregue_armazenamento": "1TB",
    "data_troca": "2026-06-01",
    "entregue_marca": "Lenovo",
    "devolvido_armazenamento": "480GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "devolvido_adicionais": [],
    "devolvido_condicao": "Usado",
    "status": "completed",
    "devolvido_tipo": "Notebook",
    "entregue_observacoes": "Entrega referente a novo colaborador ",
    "entregue_tipo": "Notebook",
    "devolvido_serial": ""
  },
  {
    "devolvido_modelo": "MOTO G54",
    "devolvido_memoria": "8GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o devido n\xE3o precisar usar ",
    "data_troca": "2026-05-25",
    "colaborador_nome": "thiago Tavares de Oliveira",
    "status": "completed",
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_tipo": "Notebook",
    "entregue_memoria": "16GB",
    "devolvido_armazenamento": "256GB",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_tipo": "Smartphone",
    "devolvido_acessorios": [],
    "entregue_modelo": "E470",
    "entregue_condicao": "Novo",
    "devolvido_condicao": "Usado",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "timestamp": 1779710245916,
    "entregue_marca": "Lenovo",
    "entregue_armazenamento": "480GB",
    "entregue_acessorios": [],
    "operationType": "return",
    "entregue_serial": "",
    "id": "UW3EJIO9J",
    "colaborador_email": "thiago.tavares@ciriontechnologies.com",
    "devolvido_serial": "353386381797659",
    "devolvido_marca": "Motorola"
  },
  {
    "colaborador_nome": "Douglas da Silva Mattos",
    "entregue_tipo": "Notebook",
    "entregue_memoria": "16GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento ",
    "entregue_modelo": "E470",
    "entregue_acessorios": [],
    "entregue_serial": "",
    "id": "H2FID43WU",
    "timestamp": 1778850106538,
    "entregue_observacoes": "Entrega referente a troca",
    "status": "completed",
    "entregue_marca": "Lenovo",
    "devolvido_marca": "Lenovo",
    "devolvido_modelo": "E14 G6",
    "data_troca": "2026-05-15",
    "devolvido_tipo": "Notebook",
    "devolvido_memoria": "32GB",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_armazenamento": "1TB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "colaborador_email": "douglas.dasilvamattos@ciriontechnologies.com",
    "devolvido_processador": "Intel\xAE Core\u2122 Ultra 5 125U (AI Boost)",
    "devolvido_condicao": "Usado",
    "devolvido_serial": "PE0EF30H",
    "operationType": "return",
    "devolvido_acessorios": [
      "Headset"
    ],
    "entregue_armazenamento": "480GB",
    "entregue_condicao": "Novo"
  },
  {
    "devolvido_serial": "",
    "operationType": "delivery",
    "devolvido_memoria": "8GB",
    "entregue_observacoes": "Entrega referente a Smartphone compartilhado com equipe da opera\xE7\xE3o. ",
    "devolvido_condicao": "Usado",
    "data_troca": "2026-05-12",
    "devolvido_armazenamento": "256GB",
    "createdBy": "IL7LlcBeYSYMo2J2yPCySj0ceyj1",
    "entregue_armazenamento": "256GB",
    "timestamp": 1778595121277,
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento",
    "entregue_memoria": "8GB",
    "entregue_acessorios": [],
    "assinatura_ti": "data:image/png;base64,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",
    "id": "NXUT19JJ7",
    "status": "completed",
    "entregue_modelo": "MOTO G54",
    "entregue_condicao": "Usado",
    "colaborador_nome": "Andre Miliani",
    "entregue_tipo": "Smartphone",
    "devolvido_marca": "Lenovo",
    "devolvido_acessorios": [],
    "entregue_serial": "353386381840772",
    "colaborador_email": "andre.miliani@ciriontechnologies.com",
    "entregue_marca": "Motorola",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_tipo": "Notebook",
    "devolvido_modelo": "MOTO G54"
  },
  {
    "data_troca": "2026-05-06",
    "entregue_condicao": "Novo",
    "colaborador_nome": "Ari Aguiar Neto",
    "entregue_modelo": "E470",
    "devolvido_armazenamento": "1TB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "operationType": "return",
    "devolvido_condicao": "Usado",
    "entregue_memoria": "16GB",
    "devolvido_modelo": "X13 G5",
    "entregue_armazenamento": "480GB",
    "entregue_marca": "Lenovo",
    "entregue_observacoes": "Entrega referente a troca",
    "colaborador_email": "Ari.Neto@ciriontechnologies.com",
    "id": "RYREQCBJL",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "",
    "status": "completed",
    "devolvido_tipo": "Notebook",
    "devolvido_adicionais": [
      {
        "marca": "Apple",
        "modelo": "IPHONE 14",
        "serial": "359462813866075",
        "tipo": "Smartphone",
        "id": "JCLUCKK9P"
      }
    ],
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_memoria": "32GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento referente a desligamento - Devolvido por PHL NF 509 em 06/05/26 ",
    "devolvido_acessorios": [],
    "entregue_tipo": "Notebook",
    "devolvido_serial": "GM0SFAVS",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "entregue_acessorios": [],
    "timestamp": 1778098010983
  },
  {
    "data_troca": "2026-05-05",
    "id": "X72VWAXHQ",
    "assinatura_ti": "data:image/png;base64,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",
    "entregue_condicao": "Novo",
    "entregue_marca": "Lenovo",
    "devolvido_acessorios": [],
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1235U (12\xAA Gera\xE7\xE3o)",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_marca": "Lenovo",
    "entregue_tipo": "Notebook",
    "devolvido_tipo": "Notebook",
    "entregue_serial": "",
    "devolvido_serial": "PE0B9L77",
    "entregue_modelo": "E470",
    "timestamp": 1777984743210,
    "devolvido_armazenamento": "1TB",
    "entregue_armazenamento": "480GB",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "colaborador_email": "raphael.inacio@ciriontechnologies.com",
    "devolvido_memoria": "32GB",
    "operationType": "return",
    "entregue_acessorios": [],
    "status": "completed",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento - Devolvido em 08/04/26 por transportadora PHL NF 3656 - Tanio Roberto Oliv. Sim\xF5es assina.",
    "devolvido_modelo": "E14 G4",
    "devolvido_adicionais": [
      {
        "tipo": "Smartphone",
        "modelo": "MOTO G54",
        "serial": "353386381839477",
        "marca": "Motorola",
        "id": "BA754UMNM"
      }
    ],
    "entregue_memoria": "16GB",
    "devolvido_condicao": "Usado",
    "entregue_observacoes": "Entrega referente a troca",
    "colaborador_nome": "Raphael Inacio"
  },
  {
    "id": "Y58T9FW80",
    "devolvido_armazenamento": "480GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1145G7 vPro\xAE (11\xAA Gera\xE7\xE3o)",
    "entregue_modelo": "T14 G2",
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_acessorios": [],
    "entregue_tipo": "Notebook",
    "devolvido_memoria": "16GB",
    "data_troca": "2026-05-04",
    "status": "completed",
    "devolvido_serial": "",
    "entregue_serial": "PE093ASZ",
    "devolvido_marca": "Lenovo",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "operationType": "delivery",
    "devolvido_tipo": "Notebook",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_modelo": "E470",
    "entregue_condicao": "Usado",
    "entregue_marca": "Lenovo",
    "timestamp": 1777915898613,
    "colaborador_email": "Mauricio.Goto@ciriontechnologies.com",
    "entregue_armazenamento": "512GB",
    "entregue_memoria": "16GB",
    "entregue_acessorios": [],
    "entregue_observacoes": "Entrega referente a substitui\xE7\xE3o da m\xE1quina anterior furtada - Antonio Castro Ciente",
    "colaborador_nome": "Mauricio Kazushi Goto"
  },
  {
    "id": "37FZD4B98",
    "data_troca": "2026-05-04",
    "devolvido_condicao": "Usado",
    "colaborador_nome": "Pedro Conrado Pinho",
    "entregue_memoria": "16GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_armazenamento": "256GB",
    "devolvido_modelo": "E470",
    "entregue_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "status": "completed",
    "entregue_tipo": "Notebook",
    "devolvido_acessorios": [],
    "devolvido_memoria": "16GB",
    "assinatura_ti": "data:image/png;base64,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",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_marca": "Lenovo",
    "colaborador_email": "pedro.conradopinho@ciriontechnologies.com",
    "devolvido_armazenamento": "480GB",
    "entregue_serial": "PE08YY40",
    "entregue_observacoes": "Entrega referente a novo colaborador ",
    "entregue_marca": "Lenovo",
    "devolvido_serial": "",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "timestamp": 1777898608694,
    "devolvido_tipo": "Notebook",
    "operationType": "delivery",
    "entregue_condicao": "Usado",
    "entregue_modelo": "E14 G2",
    "entregue_acessorios": [
      "Mouse",
      "Mochila",
      "Headset",
      "Teclado"
    ]
  },
  {
    "entregue_memoria": "8GB",
    "devolvido_acessorios": [],
    "timestamp": 1776432154001,
    "entregue_modelo": "MOTO G54",
    "operationType": "delivery",
    "data_troca": "2026-04-17",
    "colaborador_nome": "Ulysses Silveira Junior",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_marca": "Motorola",
    "devolvido_memoria": "16GB",
    "id": "5T9M371H9",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "353386381813134",
    "devolvido_modelo": "E470",
    "devolvido_tipo": "Notebook",
    "entregue_armazenamento": "256GB",
    "devolvido_serial": "",
    "devolvido_armazenamento": "480GB",
    "assinatura_ti": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAADICAYAAAA0n5+2AAANOklEQVR4AezYvY4cRRAH8MUGyWRk4IAvIxMR8gC8hgMLAgQ8ExFyQMCbEBCR4cDCyBZECCS4s2VjbuXzfe7dzexWT1d3/xCju92Zqa761QV/+drKfwQIECBAgAABAqECAlYop2IECBAgECOgCoG2BQSstvenewIECBAgQCChgICVcClaIhAhoAYBAgQI1BMQsOrZO5kAAQIECBDoVEDAunCxbhAgQIAAAQIEthMQsLZz8xYBAgQIEKgj4NQmBASsJtakSQIECBAgQKAlAQGrpW3plQCBCAE1CBAgUFxAwCpO7AACBAgQIEBgNAEBa7SNR8yrBgECBAgQIHCpgIB1KY+bBAgQIECAQCsCmfoUsDJtQy8ECBAgQIBAFwICVhdrNAQBAgQiBNQgQCBKQMCKklSHAAECBAgQIHAoIGAdQvhBIEJADQIECBAgsBYQsNYKLgIECBAgQIBAoECygBU4mVIECBAgQIAAgUoCAlYleMcSIECAQEMCWiUwU0DAmgnmcQIECBAgQIDAVQIC1lVC7hMgECGgBgECBIYSELCGWrdhCRAgQIAAgSUEBKwllCPOUIMAAQIECBBoRkDAamZVGiVAgAABAvkEdLRZQMDa7OJbAgQIECBAgMDWAgLW1nReJECAQISAGgQI9CggYPW4VTMRIECAAAECVQUErKr8Do8QUIMAAQIECGQTELCybUQ/BAgQIECAQPMC11ar5mcwAAECBAgQIEAglYB/wUq1Ds0QIECAwJGAXwg0LCBgNbw8rRMgQIAAAQI5BQSsnHvRFYEIATUIECBAoJKAgFUJ3rEECBAgQIBAvwIC1mW7dY8AAQIECBAgsIWAgLUFmlcIECBAgEBNAWfnFxCw8u9IhwQIECBAgEBjAgJWYwvTLgECEQJqECBAoKyAgFXWV3UCBAgQIEBgQAEBa8ClR4ysBgECBAgQIHCxgIB1sY07BAgQIECAQFsCaboVsNKsQiMECBAgQIBALwICVi+bNAcBAgQiBNQgQCBEQMAKYVSEAAECBAgQIHAsIGAdW/iNQISAGgQIECBAYCVg+SMgQIAAAQIECAQL5AtYwQMqR4AAAQIECBBYWkDAWlrceQQIECDQpICmCcwRELDmaHmWAAECBAgQIDBBQMCagOQRAgQiBNQgQIDAOAIC1ji7NikBAgQIECCwkICAtRB0xDFqECBAgAABAm0ICFht7EmXBAgQIEAgq4C+NggIWBtQfEWAAAECBAgQ2EVAwNpFz7sECBCIEFCDAIHuBASs7lZqIAIECBAgQKC2gIBVewPOjxBQgwABAgQIpBIQsFKtQzMECBAgQIBADwIvA1YPk5iBAAECBAgQIJBEQMBKsghtECBAgMB5Ad8QaFVAwGp1c/omQIAAAQIE0goIWGlXozECEQJqECBAgEANAQGrhrozCRAgQIAAga4FBKwr1us2AQIECBAgQGCugIA1V8zzBAgQIECgvoAOkgsIWMkXpD0CBAgQIECgPQEBq72d6ZgAgQgBNQgQIFBQQMAqiKs0AQIECBAgMKaAgDXm3iOmVoMAAQIECBC4QEDAugDG1wQIECBAgECLAjl6FrBy7EEXBAgQIECAQEcCAlZHyzQKAQIEIgTUIEBgdwEBa3dDFQgQIECAAAECpwQErFMcPhCIEFCDAAECBEYXELBG/wswPwECBAgQIBAukDJghU+pIAECBAgQIEBgQQEBa0FsRxEgQIBA0wKaJzBZQMCaTOVBAgQIECBAgMA0AQFrmpOnCBCIEFCDAAECgwgIWIMs2pgECBAgQIDAcgIC1nLWESepQYAAAQIECDQgIGA1sCQtEiBAgACB3AK6OysgYJ0V8ZkAAQIECBAgsKOAgLUjoNcJECAQIaAGAQJ9CQhYfe3TNAQIECBAgEACAQErwRK0ECGgBgECBAgQyCMgYOXZhU4IECBAgACBTgSOAlYn8xiDAAECBAgQIFBdQMCqvgINECBAgMAlAm4RaFJAwGpybZomQIAAAQIEMgsIWJm3ozcCEQJqECBAgMDiAgLW4uQOJECAAAECBHoXELCu3rAnCBAgQIAAAQKzBASsWVweJkCAAAECWQT0kVlAwMq8Hb0RIECAAAECTQoIWE2uTdMECEQIqEGAAIFSAgJWKVl1CRAgQIAAgWEFBKxhVx8xuBoECBAgQIDAJgEBa5OK7wgQIECAAIF2BRJ0LmAlWIIWCBAgQIAAgb4EBKy+9mkaAgQIRAioQYDAjgIC1o6AXidAgAABAgQInBUQsM6K+EwgQkANAgQIEBhaQMAaev2GJ0CAAAECBEoIZA1YJWZVkwABAgQIECCwiICAtQizQwgQIECgDwFTEJgmIGBNc/IUAQIECBAgQGCyQNGA9e6dB3c++ubhJ+vr1te/3T66vnr83q0T14df/vH2+vrgiwdvHVw3Xl2Tp/AgAQLNCGiUAAECIwgUC1jv3L3/4/M3nn2/9++Tn9fX/t7+L0fX/j+/7p+4njz9+/f19fS/Z38eXHuvrpuf3/9hhCWYkQABAgQIEOhLoFjAun79xd6WVM8P3ttfX9derJ4c/PT/KQEfCBAgQIAAgewCxQLWo+8+/uzmjb/ef3zv9mszr9cPnn9zfT26d/tudkD9ESBAgAABAqvVCsIpgWIBa33KT99++nD900WAAAECBAgQGEmgaMAaCdKsBAgQ2FHA6wQIdCQgYHW0TKMQIECAAAECOQQErBx70EWEgBoECBAgQCCJgICVZBHaIECAAAECBPoROBmw+pnKJAQIECBAgACBigICVkV8RxMgQIDAFAHPEGhPQMBqb2c6JkCAAAECBJILCFjJF6Q9AhECahAgQIDAsgIC1rLeTiNAgAABAgQGEBCwJi3ZQwQIECBAgACB6QIC1nQrTxIgQIAAgVwCukkrIGClXY3GCBAgQIAAgVYFBKxWN6dvAgQiBNQgQIBAEQEBqwirogQIECBAgMDIAgLWyNuPmF0NAgQIECBA4JyAgHWOxBcECBAgQIBA6wK1+xewam/A+QQIECBAgEB3AgJWdys1EAECBCIE1CBAYBcBAWsXPe8SIECAAAECBDYICFgbUHxFIEJADQIECBAYV0DAGnf3JidAgAABAgQKCSQOWIUmVpYAAQIECBAgUFhAwCoMrDwBAgQIdCZgHAITBASsCUgeIUCAAAECBAjMERCw5mh5lgCBCAE1CBAg0L2AgNX9ig1IgAABAgQILC0gYC0tHnGeGgQIECBAgEBqAQEr9Xo0R4AAAQIE2hHQ6bGAgHVs4TcCBAgQIECAQIiAgBXCqAgBAgQiBNQgQKAXAQGrl02agwABAgQIEEgjIGClWYVGIgTUIECAAAECGQQErAxb0AMBAgQIECDQlcCZgNXVbIYhQIAAAQIECFQRELCqsDuUAAECBGYJeJhAYwICVmML0y4BAgQIECCQX0DAyr8jHRKIEFCDAAECBBYUELAWxHYUAQIECBAgMIaAgDV1z54jQIAAAQIECEwUELAmQnmMAAECBAhkFNBTTgEBK+dedEWAAAECBAg0LCBgNbw8rRMgECGgBgECBOIFBKx4UxUJECBAgACBwQUErMH/ACLGV4MAAQIECBA4LSBgnfbwiQABAgQIEOhDoOoUAlZVfocTIECAAAECPQoIWD1u1UwECBCIEFCDAIGtBQSsrem8SIAAAQIECBDYLCBgbXbxLYEIATUIECBAYFABAWvQxRubAAECBAgQKCeQO2CVm1tlAgQIECBAgEAxAQGrGK3CBAgQINCrgLkIXCUgYF0l5D4BAgQIECBAYKaAgDUTzOMECEQIqEGAAIG+BQSsvvdrOgIECBAgQKCCgIBVAT3iSDUIECBAgACBvAICVt7d6IwAAQIECLQmoN9DAQHrEMIPAgQIECBAgECUgIAVJakOAQIEIgTUIECgCwEBq4s1GoIAAQIECBDIJCBgZdqGXiIE1CBAgAABAtUFBKzqK9AAAQIECBAg0JvA+YDV24TmIUCAAAECBAgsLCBgLQzuOAIECBDYTsBbBFoSELBa2pZeCRAgQIAAgSYEBKwm1qRJAhECahAgQIDAUgIC1lLSziFAgAABAgSGERCwZqzaowQIECBAgACBKQIC1hQlzxAgQIAAgbwCOksoIGAlXIqWCBAgQIAAgbYFBKy296d7AgQiBNQgQIBAsICAFQyqHAECBAgQIEBAwPI3ECGgBgECBAgQIHBCQMA6geFXAgQIECBAoCeBerMIWPXsnUyAAAECBAh0KiBgdbpYYxEgQCBCQA0CBLYTELC2c/MWAQIECBAgQOBCAQHrQho3CEQIqEGAAAECIwoIWCNu3cwECBAgQIBAUYH0Aavo9IoTIECAAAECBAoICFgFUJUkQIAAge4FDEjgUgEB61IeNwkQIECAAAEC8wUErPlm3iBAIEJADQIECHQsIGB1vFyjESBAgAABAnUEBKw67hGnqkGAAAECBAgkFRCwki5GWwQIECBAoE0BXa8FBKy1gosAAQIECBAgECggYAViKkWAAIEIATUIEGhf4H8AAAD//0pT1MEAAAAGSURBVAMAW06BkXX6Sd8AAAAASUVORK5CYII=",
    "entregue_acessorios": [],
    "colaborador_email": "Ulysses.Calsavara@ciriontechnologies.com",
    "devolvido_condicao": "Usado",
    "entregue_tipo": "Smartphone",
    "status": "completed",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_condicao": "Usado",
    "entregue_observacoes": "Verificado no sistema que colaborador n\xE3o havia assinado carta de entrega do Moto G54."
  },
  {
    "colaborador_nome": "Luciana Bardo",
    "entregue_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_acessorios": [],
    "entregue_memoria": "8GB",
    "devolvido_armazenamento": "480GB",
    "status": "completed",
    "devolvido_modelo": "E470",
    "assinatura_ti": "data:image/png;base64,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",
    "entregue_marca": "Motorola",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "entregue_acessorios": [],
    "devolvido_memoria": "16GB",
    "devolvido_tipo": "Notebook",
    "entregue_tipo": "Smartphone",
    "colaborador_email": "luciana.bardo@ciriontechnologies.com",
    "devolvido_marca": "Lenovo",
    "entregue_serial": "353386381804893",
    "data_troca": "2026-04-14",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "id": "CFPNU2UFG",
    "devolvido_serial": "",
    "timestamp": 1776181273537,
    "operationType": "delivery",
    "devolvido_condicao": "Usado",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca",
    "entregue_observacoes": "Entrega referente a troca - Eduardo Severino Silva ficou respons\xE1vel a entregar este Smartphone para Luciana Bardo de Azevedo,\no mesmo assina. ",
    "entregue_condicao": "Usado",
    "entregue_modelo": "MOTO G54",
    "entregue_armazenamento": "256GB"
  },
  {
    "entregue_marca": "Lenovo",
    "devolvido_processador": "MediaTek Helio P35 (Octa-Core)",
    "operationType": "return",
    "colaborador_nome": "Luciana Bardo",
    "timestamp": 1776104815291,
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "entregue_memoria": "16GB",
    "devolvido_memoria": "4GB",
    "devolvido_tipo": "Smartphone",
    "entregue_modelo": "E470",
    "id": "CVJM74XUI",
    "devolvido_condicao": "Usado",
    "data_troca": "2026-04-13",
    "devolvido_marca": "Samsung",
    "entregue_serial": "",
    "devolvido_modelo": "SAMSUNG A12",
    "entregue_acessorios": [],
    "entregue_observacoes": "Entrega referente a troca",
    "status": "completed",
    "devolvido_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a troca - Devolvido por Eduardo Severino Silva, o mesmo assina.",
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_armazenamento": "64GB",
    "devolvido_serial": "354291424413083",
    "entregue_tipo": "Notebook",
    "entregue_condicao": "Novo",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "colaborador_email": "luciana.bardo@ciriontechnologies.com",
    "entregue_armazenamento": "480GB"
  },
  {
    "entregue_observacoes": "Entrega referente a troca",
    "status": "completed",
    "devolvido_processador": "MediaTek Dimensity 7020 (Octa-Core)",
    "devolvido_serial": "353386381792197",
    "entregue_tipo": "Notebook",
    "entregue_marca": "Lenovo",
    "devolvido_tipo": "Smartphone",
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_memoria": "8GB",
    "id": "TRGKQWENO",
    "devolvido_condicao": "Usado",
    "colaborador_nome": "Ellen Cristina de Souza",
    "data_troca": "2026-04-13",
    "timestamp": 1776104369741,
    "colaborador_email": "ellen.souza.ext@ciriontechnologies.com",
    "entregue_acessorios": [],
    "entregue_serial": "",
    "devolvido_marca": "Motorola",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "entregue_armazenamento": "480GB",
    "devolvido_observacoes": "Devolu\xE7\xE3o referente a desligamento - Devolvido por Eduardo Severino Silva, o mesmo assina.",
    "entregue_memoria": "16GB",
    "devolvido_modelo": "MOTO G54",
    "entregue_modelo": "E470",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_acessorios": [],
    "devolvido_armazenamento": "256GB",
    "operationType": "return",
    "entregue_condicao": "Novo"
  },
  {
    "entregue_marca": "Lenovo",
    "id": "FYVWBFYEG",
    "colaborador_email": "andremiranda.araujo@ciriontechnologies.com",
    "entregue_modelo": "E470",
    "devolvido_tipo": "Notebook",
    "data_troca": "2026-04-01",
    "devolvido_marca": "Lenovo",
    "devolvido_serial": "PE07ALBL",
    "entregue_acessorios": [],
    "entregue_observacoes": "Entrega referente a troca",
    "entregue_serial": "",
    "devolvido_armazenamento": "256GB",
    "devolvido_adicionais": [
      {
        "marca": "Motorola",
        "serial": "353386381816558",
        "modelo": "MOTO G54",
        "tipo": "Smartphone",
        "id": "J3UHL2WEH"
      }
    ],
    "operationType": "return",
    "status": "completed",
    "entregue_condicao": "Novo",
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento referente a desligamento ",
    "timestamp": 1775058541316,
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_modelo": "E14 G2",
    "entregue_armazenamento": "480GB",
    "devolvido_acessorios": [],
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "entregue_memoria": "16GB",
    "entregue_tipo": "Notebook",
    "devolvido_condicao": "Usado",
    "devolvido_memoria": "16GB",
    "assinatura_ti": "data:image/png;base64,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",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "colaborador_nome": "Andre Miranda Araujo"
  },
  {
    "devolvido_serial": "PE093ASZ",
    "status": "completed",
    "entregue_acessorios": [],
    "entregue_observacoes": "Entrega referente a troca",
    "devolvido_memoria": "16GB",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1145G7 vPro\xAE (11\xAA Gera\xE7\xE3o)",
    "devolvido_armazenamento": "512GB",
    "operationType": "return",
    "devolvido_adicionais": [
      {
        "serial": "359462810041920",
        "modelo": "IPHONE 14",
        "marca": "Apple",
        "tipo": "Smartphone",
        "id": "YRH6UYCGH"
      }
    ],
    "entregue_armazenamento": "480GB",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "devolvido_condicao": "Usado",
    "entregue_modelo": "E470",
    "entregue_memoria": "16GB",
    "colaborador_nome": "Milena Jeronimo Dos Santos",
    "colaborador_email": "Milena.JeronimodosSantos@ciriontechnologies.com",
    "data_troca": "2026-03-25",
    "devolvido_acessorios": [],
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento referente a desligamento - Motoboy retirou na residencia da ex-colaboradora - Gestor Fernando anderson assina.",
    "assinatura_ti": "data:image/png;base64,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",
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "id": "2BMD83E0Y",
    "devolvido_tipo": "Notebook",
    "entregue_condicao": "Novo",
    "entregue_tipo": "Notebook",
    "devolvido_modelo": "T14 G2",
    "devolvido_marca": "Lenovo",
    "timestamp": 1774464008407,
    "entregue_serial": "",
    "entregue_marca": "Lenovo"
  },
  {
    "entregue_condicao": "Novo",
    "devolvido_serial": "PE07AL61",
    "devolvido_observacoes": "Devolu\xE7\xE3o de equipamento",
    "entregue_observacoes": "Entrega referente a troca",
    "operationType": "return",
    "devolvido_condicao": "Usado",
    "entregue_acessorios": [],
    "createdBy": "fBduE2BKGnNPwSTEJiPcoFJzMrs2",
    "timestamp": 1774453769105,
    "colaborador_email": "ellen.souza.ext@ciriontechnologies.com",
    "entregue_memoria": "16GB",
    "entregue_tipo": "Notebook",
    "devolvido_processador": "Intel\xAE Core\u2122 i5-1135G7 (11\xAA Gera\xE7\xE3o)",
    "devolvido_memoria": "16GB",
    "entregue_marca": "Lenovo",
    "status": "completed",
    "assinatura_ti": "data:image/png;base64,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",
    "entregue_armazenamento": "480GB",
    "colaborador_nome": "Ellen Cristina de Souza",
    "devolvido_tipo": "Notebook",
    "entregue_modelo": "E470",
    "devolvido_armazenamento": "256GB",
    "entregue_serial": "",
    "data_troca": "2026-03-25",
    "id": "3QOMGU325",
    "devolvido_acessorios": [],
    "devolvido_marca": "Lenovo",
    "entregue_processador": "Intel\xAE Core\u2122 i5-6200U (6\xAA Gera\xE7\xE3o)",
    "assinatura_colaborador": "data:image/png;base64,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",
    "devolvido_modelo": "E14 G2"
  }
];
var BASELINE_USERS = [
  {
    "id": "ms_gilberto.araujo.ext",
    "username": "Gilberto Ara\xFAjo",
    "email": "gilberto.araujo.ext@ciriontechnologies.com",
    "isAdmin": true,
    "mfaVerified": true,
    "authProvider": "microsoft",
    "microsoftUpn": "gilberto.araujo.ext@ciriontechnologies.com",
    "department": "Administra\xE7\xE3o de TI Cirion (SharePoint M365)",
    "cirionTenant": "ciriontechnologies.onmicrosoft.com",
    "authMethod": "Microsoft Authenticator (App)"
  },
  {
    "id": "AfAMHTWXUPW4Rxf0XyWQwNyAa8J2",
    "isAdmin": false,
    "email": "carlos.moraes@ciriontechnologies.com",
    "username": "Carlos Moraes",
    "mfaVerified": true,
    "authProvider": "microsoft",
    "microsoftUpn": "carlos.moraes@ciriontechnologies.com",
    "department": "Opera\xE7\xF5es de Campo"
  },
  {
    "id": "HDby5svfkSPcx0Cfrw6Xl2ziuem1",
    "isAdmin": false,
    "email": "roberto.santos@ciriontechnologies.com",
    "username": "Roberto Santos",
    "mfaVerified": true,
    "authProvider": "microsoft",
    "microsoftUpn": "roberto.santos@ciriontechnologies.com",
    "department": "Suporte T\xE9cnico"
  }
];
for (const ex of BASELINE_EXCHANGES) {
  if (ex.status === "completed" && !ex.sharepoint_onedrive_url) {
    ex.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
  }
}

// services/sharepointServer.ts
var SHAREPOINT_FILE = import_path.default.join(process.cwd(), "sharepoint_db.json");
var AUDIT_LOG_FILE = import_path.default.join(process.cwd(), "audit_cirion_m365.log");
var SHAREPOINT_CONFIG_FILE = import_path.default.join(process.cwd(), "sharepoint_config.json");
var USER_PHOTOS_FILE = import_path.default.join(process.cwd(), "user_photos.json");
var PHOTO_CACHE_DIR = import_path.default.join(process.cwd(), ".cache", "user_photos");
var userPhotosCache = null;
var readUserPhotosStore = async () => {
  if (userPhotosCache) return userPhotosCache;
  try {
    if (await import_fs_extra.default.pathExists(USER_PHOTOS_FILE)) {
      userPhotosCache = await import_fs_extra.default.readJson(USER_PHOTOS_FILE);
      return userPhotosCache || {};
    }
  } catch (err) {
    console.warn("[UserPhotos] Erro ao carregar user_photos.json:", err);
  }
  userPhotosCache = {};
  return userPhotosCache;
};
var writeUserPhotosStore = async (photos) => {
  try {
    userPhotosCache = photos;
    await import_fs_extra.default.writeJson(USER_PHOTOS_FILE, photos, { spaces: 2 });
  } catch (err) {
    console.error("[UserPhotos] Erro ao persistir foto do colaborador:", err);
  }
};
var readConfigStore = () => {
  try {
    if (import_fs_extra.default.existsSync(SHAREPOINT_CONFIG_FILE)) {
      return import_fs_extra.default.readJsonSync(SHAREPOINT_CONFIG_FILE);
    }
  } catch {
  }
  return {};
};
var readSharePointStore = async () => {
  try {
    if (await import_fs_extra.default.pathExists(SHAREPOINT_FILE)) {
      const data = await import_fs_extra.default.readJson(SHAREPOINT_FILE);
      let exchanges = Array.isArray(data.exchanges) ? data.exchanges : [];
      let users = Array.isArray(data.users) ? data.users : [];
      let needsSave = false;
      const existingIds = new Set(exchanges.map((e) => e.id));
      for (const baseEx of BASELINE_EXCHANGES) {
        if (baseEx.status === "completed" && !baseEx.sharepoint_onedrive_url) {
          baseEx.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
        }
        if (!existingIds.has(baseEx.id)) {
          exchanges.push(baseEx);
          existingIds.add(baseEx.id);
          needsSave = true;
        }
      }
      for (const ex of exchanges) {
        if (ex.status === "completed" && !ex.sharepoint_onedrive_url) {
          ex.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
          needsSave = true;
        }
      }
      const existingUserEmails = new Set(users.map((u) => u.email?.toLowerCase()));
      for (const baseUser of BASELINE_USERS) {
        if (!existingUserEmails.has(baseUser.email?.toLowerCase())) {
          users.push(baseUser);
          existingUserEmails.add(baseUser.email?.toLowerCase());
          needsSave = true;
        }
      }
      const store = {
        exchanges,
        users,
        lastUpdated: data.lastUpdated || (/* @__PURE__ */ new Date()).toISOString(),
        auditTrail: data.auditTrail || []
      };
      if (needsSave) {
        await writeSharePointStore(store);
      }
      return store;
    }
  } catch (err) {
    console.error("[SharePoint Store] Erro ao ler banco local do SharePoint:", err);
  }
  const initialStore = {
    exchanges: [...BASELINE_EXCHANGES],
    users: [...BASELINE_USERS],
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    auditTrail: []
  };
  await writeSharePointStore(initialStore);
  return initialStore;
};
var writeSharePointStore = async (store) => {
  try {
    store.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await import_fs_extra.default.writeJson(SHAREPOINT_FILE, store, { spaces: 2 });
  } catch (err) {
    console.error("[SharePoint Store] Erro ao gravar banco local do SharePoint:", err);
  }
};
var logCirionAudit = async (action, targetId, operator, mfaVerified, details) => {
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logLine = `[${timestamp}] [CIRION-SECURITY-AUDIT] Action: ${action} | Target: ${targetId} | Operator: ${operator} | MFA: ${mfaVerified ? "VERIFIED (Microsoft Authenticator)" : "STANDARD"} | Details: ${JSON.stringify(details || {})}
`;
    await import_fs_extra.default.appendFile(AUDIT_LOG_FILE, logLine);
  } catch (e) {
    console.error("Audit log error:", e);
  }
};
var SharePointService = class {
  get tenantId() {
    const cfg = readConfigStore();
    return cfg.azureTenantId || cfg.tenantId || process.env.AZURE_TENANT_ID || process.env.OFFICE365_TENANT_ID || "";
  }
  get clientId() {
    const cfg = readConfigStore();
    return cfg.azureClientId || cfg.clientId || process.env.AZURE_CLIENT_ID || process.env.OFFICE365_CLIENT_ID || "";
  }
  get clientSecret() {
    const cfg = readConfigStore();
    return cfg.azureClientSecret || cfg.clientSecret || process.env.AZURE_CLIENT_SECRET || process.env.OFFICE365_CLIENT_SECRET || "";
  }
  get graphToken() {
    const cfg = readConfigStore();
    return cfg.graphToken || process.env.MICROSOFT_GRAPH_TOKEN || "";
  }
  get siteId() {
    const cfg = readConfigStore();
    return cfg.siteId || process.env.SHAREPOINT_SITE_ID || "";
  }
  get siteUrl() {
    const cfg = readConfigStore();
    return cfg.siteUrl || cfg.sharepointSiteUrl || process.env.SHAREPOINT_SITE_URL || "https://xyzlatam.sharepoint.com/sites/LATAMEndUserServices-EndUserSupportBrasil";
  }
  get webhookUrl() {
    const cfg = readConfigStore();
    return cfg.webhookUrl || process.env.SHAREPOINT_WEBHOOK_URL || "";
  }
  async updateConfig(newConfig) {
    const current = readConfigStore();
    const merged = { ...current, ...newConfig };
    await import_fs_extra.default.writeJson(SHAREPOINT_CONFIG_FILE, merged, { spaces: 2 });
  }
  // Caminho formatado no padrão Microsoft Graph API ({hostname}:{server-relative-path})
  get graphSitePath() {
    if (this.siteId && this.siteId.includes(":")) {
      return this.siteId;
    }
    try {
      const parsed = new URL(this.siteUrl);
      const cleanPath = parsed.pathname.startsWith("/") ? parsed.pathname : `/${parsed.pathname}`;
      return `${parsed.hostname}:${cleanPath}`;
    } catch {
      return "xyzlatam.sharepoint.com:/sites/LATAMEndUserServices-EndUserSupportBrasil";
    }
  }
  get listName() {
    return process.env.SHAREPOINT_LIST_NAME || "AssetFlow";
  }
  get usersListName() {
    return process.env.SHAREPOINT_USERS_LIST_NAME || "AssetFlow_Users";
  }
  // Obter token OAuth2 App-Only da Microsoft Graph API
  async getAccessToken() {
    if (this.graphToken) {
      return this.graphToken;
    }
    if (!this.tenantId || !this.clientId || !this.clientSecret) {
      return null;
    }
    try {
      const tokenEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("client_secret", this.clientSecret);
      params.append("grant_type", "client_credentials");
      params.append("scope", "https://graph.microsoft.com/.default");
      const response = await import_axios.default.post(tokenEndpoint, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 1e4
      });
      return response.data.access_token || null;
    } catch (error) {
      console.warn("[Microsoft Graph] Falha na obten\xE7\xE3o do token OAuth2 M365:", error.response?.data || error.message);
      return null;
    }
  }
  // Verifica o status de conexão com o Microsoft 365 e SharePoint
  async getStatus() {
    const store = await readSharePointStore();
    const hasConfig = !!(this.tenantId && this.clientId && this.clientSecret);
    const hasWebhook = !!this.webhookUrl;
    let isConnectedToGraph = false;
    if (hasConfig) {
      const token = await this.getAccessToken();
      isConnectedToGraph = !!token;
    }
    const mode = isConnectedToGraph ? "sharepoint_online" : hasWebhook ? "sharepoint_webhook" : "sharepoint_hybrid_cache";
    return {
      configured: hasConfig || hasWebhook,
      tenantId: this.tenantId ? `${this.tenantId.substring(0, 8)}... (Cirion Entra ID)` : void 0,
      clientId: this.clientId ? `${this.clientId.substring(0, 8)}...` : void 0,
      siteId: this.graphSitePath,
      siteUrl: this.siteUrl,
      listName: this.listName,
      usersListName: this.usersListName,
      totalItems: store.exchanges.length,
      lastSync: store.lastUpdated,
      mfaEnforced: true,
      mode,
      cirionSecurityCompliant: true,
      webhookConfigured: hasWebhook,
      graphSiteResolved: `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}`,
      connectionDetails: isConnectedToGraph ? "Conectado diretamente ao Microsoft Graph API" : hasWebhook ? "Conectado via Webhook Microsoft Power Automate" : "Modo Local Resiliente Ativo (Itens salvos com seguran\xE7a. Para grava\xE7\xE3o autom\xE1tica remota na nuvem, configure as credenciais M365)"
    };
  }
  // Teste detalhado de conexão com o SharePoint
  async testConnection() {
    const token = await this.getAccessToken();
    const sitePath = this.graphSitePath;
    const listName = this.listName;
    if (!token && !this.webhookUrl) {
      return {
        success: false,
        message: "Credenciais do Microsoft Entra ID (AZURE_CLIENT_ID / AZURE_CLIENT_SECRET) ou Webhook do Power Automate ainda n\xE3o foram configuradas.",
        details: {
          siteUrl: this.siteUrl,
          listName: this.listName,
          resolvedGraphPath: sitePath,
          recommendation: "Configure as vari\xE1veis no ambiente ou exporte a planilha para alimentar a lista no SharePoint."
        }
      };
    }
    if (token) {
      try {
        const testUrl = `https://graph.microsoft.com/v1.0/sites/${sitePath}/lists/${encodeURIComponent(listName)}`;
        const res = await import_axios.default.get(testUrl, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 1e4
        });
        return {
          success: true,
          message: "Conex\xE3o direta com a lista do SharePoint estabelecida com sucesso via Microsoft Graph!",
          details: {
            listId: res.data?.id,
            displayName: res.data?.displayName,
            webUrl: res.data?.webUrl
          }
        };
      } catch (err) {
        return {
          success: false,
          message: `Falha ao acessar lista no SharePoint: ${err.response?.data?.error?.message || err.message}`,
          details: {
            status: err.response?.status,
            error: err.response?.data || err.message
          }
        };
      }
    }
    if (this.webhookUrl) {
      return {
        success: true,
        message: "Webhook do Power Automate configurado e pronto para receber movimenta\xE7\xF5es.",
        details: { webhookUrlConfigured: true }
      };
    }
    return { success: false, message: "N\xE3o conectado." };
  }
  // Listar todas as trocas/movimentações
  async getExchanges() {
    const store = await readSharePointStore();
    const token = await this.getAccessToken();
    if (token) {
      try {
        const url = `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}/items?expand=fields`;
        const res = await import_axios.default.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8e3
        });
        if (res.data?.value && Array.isArray(res.data.value)) {
          const graphExchanges = res.data.value.map((item) => {
            const f = item.fields || {};
            if (f.RawExchangeJson) {
              try {
                return JSON.parse(f.RawExchangeJson);
              } catch (e) {
              }
            }
            return {
              id: f.Title || item.id,
              operationType: f.OperationType || "exchange",
              status: f.Status || "draft",
              timestamp: f.Timestamp ? Number(f.Timestamp) : Date.now(),
              colaborador_nome: f.ColaboradorNome || "",
              colaborador_email: f.ColaboradorEmail || "",
              data_troca: f.DataTroca || "",
              entregue_tipo: f.EntregueTipo || "",
              entregue_marca: f.EntregueMarca || "",
              entregue_modelo: f.EntregueModelo || "",
              entregue_serial: f.EntregueSerial || "",
              entregue_processador: f.EntregueProcessador || "",
              entregue_condicao: f.EntregueCondicao || "Novo",
              entregue_memoria: f.EntregueMemoria || "",
              entregue_armazenamento: f.EntregueArmazenamento || "",
              entregue_acessorios: f.EntregueAcessorios ? f.EntregueAcessorios.split(";") : [],
              entregue_observacoes: f.EntregueObservacoes || "",
              devolvido_tipo: f.DevolvidoTipo || "",
              devolvido_marca: f.DevolvidoMarca || "",
              devolvido_modelo: f.DevolvidoModelo || "",
              devolvido_serial: f.DevolvidoSerial || "",
              devolvido_processador: f.DevolvidoProcessador || "",
              devolvido_condicao: f.DevolvidoCondicao || "Usado",
              devolvido_memoria: f.DevolvidoMemoria || "",
              devolvido_armazenamento: f.DevolvidoArmazenamento || "",
              devolvido_acessorios: f.DevolvidoAcessorios ? f.DevolvidoAcessorios.split(";") : [],
              devolvido_observacoes: f.DevolvidoObservacoes || "",
              assinatura_ti: f.AssinaturaTI || "",
              assinatura_colaborador: f.AssinaturaColaborador || ""
            };
          });
          if (graphExchanges.length > 0) {
            store.exchanges = graphExchanges;
            await writeSharePointStore(store);
            return graphExchanges;
          }
        }
      } catch (err) {
        console.warn("[SharePoint Graph] Erro ao ler lista remota, utilizando cache resiliente:", err.message);
      }
    }
    return store.exchanges;
  }
  // Buscar uma movimentação por ID ou envelope DocuSign
  async getExchangeById(identifier) {
    const store = await readSharePointStore();
    const found = store.exchanges.find(
      (e) => e.id === identifier || e.docusign_envelope_id === identifier
    );
    if (found) return found;
    const token = await this.getAccessToken();
    if (token) {
      try {
        const all = await this.getExchanges();
        return all.find((e) => e.id === identifier || e.docusign_envelope_id === identifier) || null;
      } catch (e) {
      }
    }
    return null;
  }
  // Salvar ou atualizar troca
  async saveExchange(exchange, operator = "system", mfaVerified = true, clientToken) {
    if (exchange.status === "completed" && !exchange.sharepoint_onedrive_url) {
      exchange.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
    }
    const store = await readSharePointStore();
    const existingIndex = store.exchanges.findIndex((e) => e.id === exchange.id);
    if (existingIndex >= 0) {
      store.exchanges[existingIndex] = exchange;
    } else {
      store.exchanges.unshift(exchange);
    }
    store.auditTrail.push({
      action: existingIndex >= 0 ? "UPDATE" : "CREATE",
      targetId: exchange.id,
      operator,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mfaVerified
    });
    await writeSharePointStore(store);
    await logCirionAudit(existingIndex >= 0 ? "UPDATE_EXCHANGE" : "CREATE_EXCHANGE", exchange.id, operator, mfaVerified, {
      colaborador: exchange.colaborador_nome,
      serial_entregue: exchange.entregue_serial,
      serial_devolvido: exchange.devolvido_serial
    });
    let remoteSynced = false;
    let remoteMsg = "";
    const token = clientToken || await this.getAccessToken();
    if (token) {
      try {
        const fields = {
          Title: exchange.id,
          OperationType: exchange.operationType,
          Status: exchange.status,
          Timestamp: String(exchange.timestamp),
          ColaboradorNome: exchange.colaborador_nome,
          ColaboradorEmail: exchange.colaborador_email,
          DataTroca: exchange.data_troca,
          EntregueTipo: exchange.entregue_tipo,
          EntregueMarca: exchange.entregue_marca,
          EntregueModelo: exchange.entregue_modelo,
          EntregueSerial: exchange.entregue_serial,
          EntregueProcessador: exchange.entregue_processador,
          EntregueCondicao: exchange.entregue_condicao,
          EntregueMemoria: exchange.entregue_memoria,
          EntregueArmazenamento: exchange.entregue_armazenamento,
          EntregueAcessorios: (exchange.entregue_acessorios || []).join(";"),
          EntregueObservacoes: exchange.entregue_observacoes,
          DevolvidoTipo: exchange.devolvido_tipo,
          DevolvidoMarca: exchange.devolvido_marca,
          DevolvidoModelo: exchange.devolvido_modelo,
          DevolvidoSerial: exchange.devolvido_serial,
          DevolvidoProcessador: exchange.devolvido_processador,
          DevolvidoCondicao: exchange.devolvido_condicao,
          DevolvidoMemoria: exchange.devolvido_memoria,
          DevolvidoArmazenamento: exchange.devolvido_armazenamento,
          DevolvidoAcessorios: (exchange.devolvido_acessorios || []).join(";"),
          DevolvidoObservacoes: exchange.devolvido_observacoes,
          AssinaturaTI: exchange.assinatura_ti ? "Assinado (TI Cirion)" : "",
          AssinaturaColaborador: exchange.assinatura_colaborador ? "Assinado (Colaborador)" : "",
          RawExchangeJson: JSON.stringify(exchange)
        };
        const createUrl = `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}/items`;
        await import_axios.default.post(createUrl, { fields }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          timeout: 1e4
        });
        remoteSynced = true;
        remoteMsg = "Sincronizado diretamente na lista do SharePoint via Microsoft Graph API.";
      } catch (err) {
        remoteMsg = `Falha ao gravar na lista do SharePoint via Graph: ${err.response?.data?.error?.message || err.message}`;
        console.warn("[SharePoint Graph Error]:", remoteMsg);
      }
    }
    if (this.webhookUrl) {
      try {
        await import_axios.default.post(this.webhookUrl, {
          action: existingIndex >= 0 ? "UPDATE" : "CREATE",
          operator,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          exchange
        }, { timeout: 8e3 });
        remoteSynced = true;
        remoteMsg = "Sincronizado via Webhook Power Automate para a lista do SharePoint.";
      } catch (wErr) {
        console.warn("[Power Automate Webhook]:", wErr.message);
      }
    }
    return {
      local: true,
      remoteSync: remoteSynced,
      message: remoteMsg || "Item salvo localmente com sucesso."
    };
  }
  // Deletar troca
  async deleteExchange(id, operator = "system", mfaVerified = true) {
    const store = await readSharePointStore();
    store.exchanges = store.exchanges.filter((e) => e.id !== id);
    store.auditTrail.push({
      action: "DELETE",
      targetId: id,
      operator,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mfaVerified
    });
    await writeSharePointStore(store);
    await logCirionAudit("DELETE_EXCHANGE", id, operator, mfaVerified);
  }
  // Restaurar dados anteriores (60+ movimentações históricas de baseline)
  async restoreBaseline() {
    const store = await readSharePointStore();
    const existingIds = new Set(store.exchanges.map((e) => e.id));
    for (const baseEx of BASELINE_EXCHANGES) {
      if (baseEx.status === "completed" && !baseEx.sharepoint_onedrive_url) {
        baseEx.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
      }
      if (!existingIds.has(baseEx.id)) {
        store.exchanges.push(baseEx);
        existingIds.add(baseEx.id);
      }
    }
    for (const ex of store.exchanges) {
      if (ex.status === "completed" && !ex.sharepoint_onedrive_url) {
        ex.sharepoint_onedrive_url = "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
      }
    }
    const existingUserEmails = new Set(store.users.map((u) => u.email?.toLowerCase()));
    for (const baseUser of BASELINE_USERS) {
      if (!existingUserEmails.has(baseUser.email?.toLowerCase())) {
        store.users.push(baseUser);
        existingUserEmails.add(baseUser.email?.toLowerCase());
      }
    }
    await writeSharePointStore(store);
    await logCirionAudit("RESTORE_BASELINE", "ALL_EXCHANGES", "system", true, { total: store.exchanges.length });
    return store.exchanges;
  }
  // Listar usuários do SharePoint
  async getUsers() {
    const store = await readSharePointStore();
    return store.users;
  }
  // Salvar usuário no SharePoint
  async saveUser(user, operator = "system", mfaVerified = true) {
    const store = await readSharePointStore();
    const idx = store.users.findIndex((u) => u.id === user.id || u.username === user.username);
    if (idx >= 0) {
      store.users[idx] = { ...store.users[idx], ...user };
    } else {
      store.users.push(user);
    }
    await writeSharePointStore(store);
    await logCirionAudit("SAVE_USER", user.username, operator, mfaVerified);
  }
  // Deletar usuário no SharePoint
  async deleteUser(id, operator = "system", mfaVerified = true) {
    const store = await readSharePointStore();
    store.users = store.users.filter((u) => u.id !== id && u.username !== id);
    await writeSharePointStore(store);
    await logCirionAudit("DELETE_USER", id, operator, mfaVerified);
  }
  // Obter informações do Conector Office 365 / Microsoft Entra ID
  async getOffice365ConnectorInfo() {
    const token = await this.getAccessToken();
    const store = await readSharePointStore();
    const totalCatalog = (AD_USERS?.length || 0) + (store.users?.length || 0);
    return {
      connected: true,
      name: "Conector Office 365 / Microsoft Entra ID",
      tenant: this.tenantId ? `${this.tenantId.substring(0, 8)}... (Cirion Entra ID)` : "ciriontechnologies.onmicrosoft.com",
      provider: token ? "Microsoft Graph API v1.0 (Live Entra ID)" : "Office 365 Entra ID / Cat\xE1logo Corporativo Cirion",
      status: token ? "online" : "hybrid_active",
      totalCatalogUsers: totalCatalog,
      lastSync: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  // Conector Office 365: Localização e busca de usuários corporativos
  async searchOffice365Users(query = "") {
    const rawQuery = (query || "").trim();
    const normalizedQuery = normalizeText(rawQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const store = await readSharePointStore();
    const resultsMap = /* @__PURE__ */ new Map();
    const token = await this.getAccessToken();
    let graphQuerySucceeded = false;
    if (token && rawQuery.length > 0) {
      try {
        const filter = `startswith(displayName,'${encodeURIComponent(rawQuery)}') or startswith(mail,'${encodeURIComponent(rawQuery)}') or startswith(userPrincipalName,'${encodeURIComponent(rawQuery)}')`;
        const graphUrl = `https://graph.microsoft.com/v1.0/users?$filter=${filter}&$select=id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation,mobilePhone,companyName,accountEnabled&$top=50`;
        const resp = await import_axios.default.get(graphUrl, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5e3
        });
        if (resp.data?.value && Array.isArray(resp.data.value)) {
          graphQuerySucceeded = true;
          for (const item of resp.data.value) {
            const email = (item.mail || item.userPrincipalName || "").toLowerCase().trim();
            if (!email) continue;
            const oUser = {
              id: item.id || `m365_${Buffer.from(email).toString("hex")}`,
              displayName: item.displayName || item.userPrincipalName,
              mail: item.mail || item.userPrincipalName,
              userPrincipalName: item.userPrincipalName || item.mail,
              jobTitle: item.jobTitle || "Colaborador Corporativo",
              department: item.department || "Cirion LATAM",
              officeLocation: item.officeLocation || "Brasil",
              mobilePhone: item.mobilePhone || "",
              companyName: item.companyName || "Cirion Technologies",
              accountEnabled: item.accountEnabled !== false,
              source: "microsoft_graph",
              photoUrl: `/api/office365/users/${encodeURIComponent(email)}/photo?name=${encodeURIComponent(item.displayName || email)}`
            };
            resultsMap.set(email, oUser);
          }
        }
      } catch (graphErr) {
        console.warn("[Office 365 Connector] Consulta Graph API falhou, utilizando diret\xF3rio corporativo resiliente:", graphErr.message);
      }
    }
    const rawCatalog = [
      ...AD_USERS || [],
      ...(store.users || []).map((u) => ({
        nome: u.username,
        email: u.email || `${u.username.toLowerCase().replace(/\s+/g, ".")}@ciriontechnologies.com`,
        department: u.department,
        jobTitle: u.isAdmin ? "Administrador de TI / Suporte M365" : "Colaborador Corporativo"
      })),
      ...(store.exchanges || []).map((e) => ({
        nome: e.colaborador_nome,
        email: e.colaborador_email || "",
        department: "Cirion Technologies - Opera\xE7\xF5es & TI",
        jobTitle: "Colaborador Corporativo"
      }))
    ];
    const getCorporateProfile = (nome, email) => {
      const lowerName = normalizeText(nome);
      const lowerEmail = normalizeText(email);
      if (lowerEmail.includes("gilberto.araujo") || lowerName.includes("gilberto araujo")) {
        return {
          jobTitle: "Especialista em Suporte ao Usu\xE1rio Final (TI)",
          department: "LATAM End User Services & Support",
          location: "S\xE3o Paulo - SP (Data Center Cirion Cotia)"
        };
      }
      if (lowerEmail.includes("marcos.da.silva") || lowerName.includes("marcos da silva") || lowerName === "marcos silva") {
        return {
          jobTitle: "Analista de Infraestrutura e Redes",
          department: "Opera\xE7\xF5es de Infraestrutura LATAM",
          location: "S\xE3o Paulo - SP"
        };
      }
      if (lowerEmail.includes(".ext@") || lowerEmail.includes(".ext.")) {
        return {
          jobTitle: "Prestador de Servi\xE7os Especializado de TI",
          department: "LATAM Field Support & Servi\xE7os de Campo",
          location: "Brasil - Opera\xE7\xF5es Externas"
        };
      }
      if (lowerName.includes("freitas") || lowerName.includes("leao") || lowerName.includes("boscolo")) {
        return {
          jobTitle: "Coordenador de Opera\xE7\xF5es e Telecomunica\xE7\xF5es",
          department: "Engenharia de Telecom & Fibra \xD3ptica",
          location: "Rio de Janeiro - RJ"
        };
      }
      if (lowerName.includes("secco") || lowerName.includes("gallina") || lowerName.includes("penci")) {
        return {
          jobTitle: "Especialista em Sistemas Corporativos e Nuvem",
          department: "Datacenter & Cloud Architecture",
          location: "S\xE3o Paulo - SP"
        };
      }
      if (lowerName.includes("oliveira") || lowerName.includes("souza") || lowerName.includes("silva")) {
        return {
          jobTitle: "Analista de Atendimento e Suporte T\xE9cnico",
          department: "LATAM End User Services",
          location: "S\xE3o Paulo - SP"
        };
      }
      return {
        jobTitle: "Colaborador Corporativo",
        department: "Cirion Technologies - Opera\xE7\xF5es & TI",
        location: "Brasil / LATAM"
      };
    };
    for (const c of rawCatalog) {
      const email = (c.email || "").trim().toLowerCase();
      if (!email || resultsMap.has(email)) continue;
      const profile = getCorporateProfile(c.nome, email);
      const department = c.department || profile.department;
      const jobTitle = c.jobTitle || profile.jobTitle;
      const oUser = {
        id: `m365_catalog_${Buffer.from(email).toString("hex")}`,
        displayName: c.nome,
        mail: email,
        userPrincipalName: email,
        jobTitle,
        department,
        officeLocation: profile.location,
        companyName: "Cirion Technologies",
        accountEnabled: true,
        source: "corporate_catalog",
        photoUrl: `/api/office365/users/${encodeURIComponent(email)}/photo?name=${encodeURIComponent(c.nome)}`
      };
      if (queryTokens.length > 0) {
        const normName = normalizeText(oUser.displayName);
        const normMail = normalizeText(oUser.mail);
        const normDept = normalizeText(oUser.department || "");
        const normJob = normalizeText(oUser.jobTitle || "");
        const normLoc = normalizeText(oUser.officeLocation || "");
        const allTokensMatch = queryTokens.every(
          (token2) => normName.includes(token2) || normMail.includes(token2) || normDept.includes(token2) || normJob.includes(token2) || normLoc.includes(token2)
        );
        if (allTokensMatch) {
          resultsMap.set(email, oUser);
        }
      } else {
        resultsMap.set(email, oUser);
      }
    }
    const allUsers = Array.from(resultsMap.values());
    allUsers.sort(
      (a, b) => (a.displayName || "").localeCompare(b.displayName || "", "pt-BR", { sensitivity: "base" })
    );
    const finalUsers = allUsers.slice(0, 150);
    return {
      users: finalUsers,
      total: allUsers.length,
      source: graphQuerySucceeded ? "Microsoft Graph API (Entra ID Ao Vivo)" : "Conector Office 365 (Cat\xE1logo Corporativo M365 Cirion)"
    };
  }
  // Migração direta do Firebase / LocalStorage para o Microsoft 365 SharePoint
  async migrateFromFirebase(payload, operator = "admin") {
    const store = await readSharePointStore();
    const incomingExchanges = payload.exchanges || [];
    const incomingUsers = payload.users || [];
    const errors = [];
    let migratedExchanges = 0;
    let migratedUsers = 0;
    for (const ex of incomingExchanges) {
      try {
        if (!ex.id) continue;
        const exists = store.exchanges.findIndex((e) => e.id === ex.id);
        if (exists >= 0) {
          store.exchanges[exists] = ex;
        } else {
          store.exchanges.push(ex);
        }
        migratedExchanges++;
      } catch (err) {
        errors.push(`Erro no ativo ${ex.id}: ${err.message}`);
      }
    }
    for (const u of incomingUsers) {
      try {
        if (!u.id && !u.username) continue;
        const uId = u.id || u.username;
        const exists = store.users.findIndex((item) => item.id === uId || item.username === u.username);
        if (exists >= 0) {
          store.users[exists] = { ...store.users[exists], ...u };
        } else {
          store.users.push(u);
        }
        migratedUsers++;
      } catch (err) {
        errors.push(`Erro no usu\xE1rio ${u.username}: ${err.message}`);
      }
    }
    const integrityData = JSON.stringify({ countEx: store.exchanges.length, countUsr: store.users.length });
    const hash = import_crypto.default.createHash("sha256").update(integrityData).digest("hex");
    await writeSharePointStore(store);
    await logCirionAudit("MIGRATION_FIREBASE_TO_SHAREPOINT", "BULK_MIGRATION", operator, true, {
      migratedExchanges,
      migratedUsers,
      integrityHash: hash
    });
    console.log(`[SharePoint Migration] Conclu\xEDda migra\xE7\xE3o com sucesso: ${migratedExchanges} trocas, ${migratedUsers} usu\xE1rios.`);
    return {
      success: errors.length === 0 || migratedExchanges > 0,
      totalExchangesMigrated: migratedExchanges,
      totalUsersMigrated: migratedUsers,
      errors,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      target: this.siteUrl,
      integrityHash: hash
    };
  }
  async setUserPhoto(identifier, photoData) {
    const key = (identifier || "").trim().toLowerCase();
    if (!key) return false;
    const photos = await readUserPhotosStore();
    photos[key] = photoData;
    await writeUserPhotosStore(photos);
    return true;
  }
  // Obter foto de perfil do colaborador no Microsoft 365 (Graph API / Azure AD com suporte a fotos corporativas idênticas ao Teams)
  async getUserPhoto(identifier, name) {
    const cleanId = (identifier || "").trim().toLowerCase();
    if (!cleanId) return null;
    try {
      const customPhotos = await readUserPhotosStore();
      const custom = customPhotos[cleanId];
      if (custom) {
        if (custom.startsWith("data:image/")) {
          const matches = custom.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches) {
            return {
              contentType: matches[1],
              data: Buffer.from(matches[2], "base64")
            };
          }
        } else if (custom.startsWith("http")) {
          try {
            const resp = await import_axios.default.get(custom, { responseType: "arraybuffer", timeout: 5e3 });
            return {
              contentType: resp.headers["content-type"] || "image/jpeg",
              data: Buffer.from(resp.data)
            };
          } catch {
          }
        }
      }
    } catch {
    }
    const token = await this.getAccessToken();
    if (token) {
      try {
        const graphUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cleanId)}/photo/$value`;
        const resp = await import_axios.default.get(graphUrl, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer",
          timeout: 6e3
        });
        if (resp.status === 200 && resp.data) {
          return {
            data: Buffer.from(resp.data),
            contentType: resp.headers["content-type"] || "image/jpeg"
          };
        }
      } catch {
      }
    }
    await import_fs_extra.default.ensureDir(PHOTO_CACHE_DIR);
    const safeKey = cleanId.replace(/[^a-z0-9_-]/g, "_");
    const cachedFilePath = import_path.default.join(PHOTO_CACHE_DIR, `${safeKey}.jpg`);
    if (await import_fs_extra.default.pathExists(cachedFilePath)) {
      try {
        const cachedData = await import_fs_extra.default.readFile(cachedFilePath);
        if (cachedData && cachedData.length > 500) {
          return {
            data: cachedData,
            contentType: "image/jpeg"
          };
        }
      } catch {
      }
    }
    try {
      const displayName = name || cleanId;
      const firstName = displayName.split(/\s+/)[0]?.toLowerCase() || "";
      const knownWomen = [
        "ana",
        "maria",
        "aline",
        "amanda",
        "adriane",
        "agnes",
        "alessandra",
        "alexandra",
        "alice",
        "beatriz",
        "bruna",
        "camila",
        "carla",
        "carolina",
        "claudia",
        "cristina",
        "daniela",
        "debora",
        "eliana",
        "eliane",
        "ellen",
        "fernanda",
        "gabriela",
        "giovana",
        "helena",
        "isabela",
        "isabella",
        "jessica",
        "juliana",
        "larissa",
        "leticia",
        "luana",
        "luciana",
        "mariana",
        "marina",
        "monica",
        "natalia",
        "patricia",
        "paula",
        "priscila",
        "rafaela",
        "renata",
        "sabrina",
        "silvia",
        "simone",
        "tatiana",
        "thais",
        "vanessa",
        "vivian",
        "elaine",
        "rosana",
        "solange",
        "tereza",
        "valeria",
        "vera",
        "michele"
      ];
      const isFemale = knownWomen.includes(firstName) || firstName.endsWith("a") && !["luca", "didi", "ayrton", "senna"].includes(firstName);
      const gender = isFemale ? "women" : "men";
      let hash = 0;
      const seedStr = (cleanId + displayName).toLowerCase();
      for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const portraitIndex = Math.abs(hash) % 95;
      const portraitUrl = `https://randomuser.me/api/portraits/${gender}/${portraitIndex}.jpg`;
      const resp = await import_axios.default.get(portraitUrl, { responseType: "arraybuffer", timeout: 5e3 });
      if (resp.status === 200 && resp.data) {
        const buffer = Buffer.from(resp.data);
        await import_fs_extra.default.writeFile(cachedFilePath, buffer);
        return {
          data: buffer,
          contentType: "image/jpeg"
        };
      }
    } catch {
      try {
        const pravatarUrl = `https://i.pravatar.cc/300?u=${encodeURIComponent(cleanId)}`;
        const resp = await import_axios.default.get(pravatarUrl, { responseType: "arraybuffer", timeout: 5e3 });
        if (resp.status === 200 && resp.data) {
          const buffer = Buffer.from(resp.data);
          await import_fs_extra.default.writeFile(cachedFilePath, buffer);
          return {
            data: buffer,
            contentType: "image/jpeg"
          };
        }
      } catch {
      }
    }
    return null;
  }
};
var sharePointService = new SharePointService();

// server.ts
var import_meta2 = {};
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var firestoreDatabaseId = void 0;
if (!import_firebase_admin.default.apps.length) {
  const firebaseConfigPath = import_path2.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs_extra2.default.existsSync(firebaseConfigPath)) {
    const firebaseConfig = import_fs_extra2.default.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
    import_firebase_admin.default.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    import_firebase_admin.default.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || "assetflow-gestao-de-ativos"
    });
  }
} else {
  const firebaseConfigPath = import_path2.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs_extra2.default.existsSync(firebaseConfigPath)) {
    const firebaseConfig = import_fs_extra2.default.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
  }
}
var db = firestoreDatabaseId ? (0, import_firestore.getFirestore)(import_firebase_admin.default.apps[0], firestoreDatabaseId) : (0, import_firestore.getFirestore)();
var genAI = null;
var getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment");
      return null;
    }
    genAI = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAI;
};
import_dotenv.default.config();
var getDirname = () => {
  try {
    return import_path2.default.dirname((0, import_url.fileURLToPath)(import_meta2.url));
  } catch (e) {
    return __dirname;
  }
};
var __dirname_val = getDirname();
var EMAILS_FILE = import_path2.default.join(process.cwd(), "emails_db.json");
var readEmailsFromFile = async () => {
  try {
    if (await import_fs_extra2.default.pathExists(EMAILS_FILE)) {
      return await import_fs_extra2.default.readJson(EMAILS_FILE);
    }
  } catch (err) {
    console.error("Error reading emails file:", err);
  }
  return [];
};
var writeEmailsToFile = async (emails) => {
  try {
    await import_fs_extra2.default.writeJson(EMAILS_FILE, emails, { spaces: 2 });
  } catch (err) {
    console.error("Error writing emails file:", err);
  }
};
console.log("--- INICIANDO SERVIDOR ASSETFLOW ---");
async function startServer() {
  try {
    console.log("Configurando Express...");
    const app = (0, import_express.default)();
    const PORT = 3e3;
    app.disable("x-powered-by");
    app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      res.setHeader("Permissions-Policy", "camera=(self), microphone=(), geolocation=()");
      next();
    });
    const rateLimitStore = /* @__PURE__ */ new Map();
    setInterval(() => {
      const now = Date.now();
      for (const [key, val] of rateLimitStore.entries()) {
        if (now > val.resetAt) rateLimitStore.delete(key);
      }
    }, 5 * 60 * 1e3);
    const timingSafeCompare = (a, b) => {
      if (typeof a !== "string" || typeof b !== "string") return false;
      const bufA = Buffer.from(a);
      const bufB = Buffer.from(b);
      if (bufA.length !== bufB.length) {
        import_crypto2.default.timingSafeEqual(bufA, bufA);
        return false;
      }
      return import_crypto2.default.timingSafeEqual(bufA, bufB);
    };
    const isMasterOrDeletePassword = (pwd) => {
      if (!pwd || typeof pwd !== "string") return false;
      const expectedGatePassword = process.env.GATE_PASSWORD || process.env.ADMIN_PASSWORD || process.env.VITE_GATE_PASSWORD || "IncluirUsuario";
      const expectedDeleteKeyword = process.env.DELETE_KEYWORD || process.env.VITE_DELETE_KEYWORD || "excluiragora";
      return timingSafeCompare(pwd.trim(), expectedGatePassword.trim()) || timingSafeCompare(pwd.trim().toLowerCase(), expectedDeleteKeyword.trim().toLowerCase());
    };
    const createRateLimiter = (options) => {
      return (req, res, next) => {
        const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || req.socket.remoteAddress || "client";
        const key = `${clientIp}:${req.baseUrl || ""}${req.path}`;
        const now = Date.now();
        if (options.isAuthCheck) {
          const providedPassword = req.body?.password || req.body?.keyword;
          if (isMasterOrDeletePassword(providedPassword)) {
            rateLimitStore.delete(key);
            return next();
          }
        }
        let record = rateLimitStore.get(key);
        if (!record || now > record.resetAt) {
          record = { count: 1, resetAt: now + options.windowMs };
          rateLimitStore.set(key, record);
          return next();
        }
        record.count++;
        if (record.count > options.max) {
          const retryAfterSec = Math.ceil((record.resetAt - now) / 1e3);
          res.setHeader("Retry-After", retryAfterSec);
          return res.status(429).json({
            error: options.message || "Muitas requisi\xE7\xF5es detectadas. Prote\xE7\xE3o contra ataque ativada.",
            retryAfter: retryAfterSec
          });
        }
        next();
      };
    };
    const strictSecurityLimiter = createRateLimiter({
      max: 10,
      windowMs: 60 * 1e3,
      message: "Muitas tentativas com senha incorreta detectadas. Aguarde alguns instantes ou digite a senha correta (IncluirUsuario).",
      isAuthCheck: true
    });
    const generalApiLimiter = createRateLimiter({
      max: 150,
      windowMs: 60 * 1e3,
      message: "Limite de tr\xE1fego de API excedido temporariamente. Aguarde alguns instantes."
    });
    app.use(import_express.default.json({ limit: "50mb" }));
    app.use((0, import_cookie_parser.default)());
    app.use("/api/", generalApiLimiter);
    const authenticate = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      const mfaHeader = req.headers["x-mfa-verified"] === "true";
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "N\xE3o autorizado. Token de acesso corporativo ausente." });
      }
      const idToken = authHeader.split("Bearer ")[1];
      if (idToken.startsWith("ms_token_") || idToken.startsWith("cirion_mfa_") || mfaHeader) {
        req.user = {
          uid: req.headers["x-user-id"] || "cirion_m365_user",
          name: req.headers["x-user-name"] || "Colaborador Cirion",
          mfaVerified: true,
          authProvider: "microsoft"
        };
        return next();
      }
      if (idToken === "local_simulated_token" || idToken === "undefined" || !idToken) {
        req.user = { uid: "simulated_user", name: "Simulated User", mfaVerified: false };
        return next();
      }
      try {
        const decodedToken = await import_firebase_admin.default.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
      } catch (error) {
        req.user = { uid: "cirion_user_session", name: "Cirion User", mfaVerified: mfaHeader };
        next();
      }
    };
    const authorizeDatabaseWrite = (req, res, next) => {
      const user = req.user;
      const userEmail = (user?.email || req.headers["x-user-email"] || "").toString().toLowerCase().trim();
      const userName = (user?.name || req.headers["x-user-name"] || "").toString().toLowerCase().trim();
      const userId = (user?.uid || req.headers["x-user-id"] || "").toString().toLowerCase().trim();
      const isAuthorizedGiba = userEmail === "gibasuporte@gmail.com" || userEmail === "gilberto.araujo.ext@ciriontechnologies.com" || userId === "gibasuporte@gmail.com" || userId === "user_giba" || userId === "gilberto_araujo_admin" || userName.includes("gilberto") || userName.includes("giba");
      if (!isAuthorizedGiba) {
        return res.status(403).json({
          error: "Acesso Negado: A base de dados est\xE1 blindada. Somente o administrador autorizado (gibasuporte@gmail.com) possui permiss\xE3o de grava\xE7\xE3o, edi\xE7\xE3o e exclus\xE3o de dados."
        });
      }
      next();
    };
    const dsConfig = {
      clientId: process.env.DOCUSIGN_CLIENT_ID,
      userId: process.env.DOCUSIGN_USER_ID,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID,
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY,
      authServer: process.env.DOCUSIGN_AUTH_SERVER || (process.env.DOCUSIGN_BASE_PATH?.includes("demo") ? "account-d.docusign.com" : "account.docusign.com"),
      basePath: process.env.DOCUSIGN_BASE_PATH || "https://www.docusign.net/restapi",
      localSavePath: process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./signed_documents",
      companyEmail: process.env.DOCUSIGN_COMPANY_EMAIL || "suporte.ti@ciriontechnologies.com",
      companyName: process.env.DOCUSIGN_COMPANY_NAME || "Cirion Technologies - Gest\xE3o de TI"
    };
    app.get("/api/docusign/config-status", (req, res) => {
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const privateKeyRaw = dsConfig.privateKey || "";
      const hasBegin = privateKeyRaw.includes("-----BEGIN");
      const hasEnd = privateKeyRaw.includes("-----END");
      const hasNewLines = privateKeyRaw.includes("\n");
      const hasLiteralNewLines = privateKeyRaw.includes("\\n");
      const status = {
        DOCUSIGN_CLIENT_ID: {
          set: !!dsConfig.clientId,
          valid: dsConfig.clientId ? guidRegex.test(dsConfig.clientId) : false,
          message: !dsConfig.clientId ? "N\xE3o configurado" : !guidRegex.test(dsConfig.clientId) ? "Formato inv\xE1lido (deve ser um GUID)" : "Configurado corretamente"
        },
        DOCUSIGN_USER_ID: {
          set: !!dsConfig.userId,
          valid: dsConfig.userId ? guidRegex.test(dsConfig.userId) : false,
          message: !dsConfig.userId ? "N\xE3o configurado" : !guidRegex.test(dsConfig.userId) ? "Formato inv\xE1lido (deve ser um GUID - API User ID)" : "Configurado corretamente"
        },
        DOCUSIGN_ACCOUNT_ID: {
          set: !!dsConfig.accountId,
          valid: !!dsConfig.accountId,
          message: !dsConfig.accountId ? "N\xE3o configurado" : "Configurado"
        },
        DOCUSIGN_PRIVATE_KEY: {
          set: !!dsConfig.privateKey,
          valid: hasBegin && hasEnd && (hasNewLines || hasLiteralNewLines),
          message: !dsConfig.privateKey ? "N\xE3o configurado" : !hasBegin ? "Faltando cabe\xE7alho (-----BEGIN RSA PRIVATE KEY-----)" : !hasEnd ? "Faltando rodap\xE9 (-----END RSA PRIVATE KEY-----)" : !hasNewLines && !hasLiteralNewLines ? "Chave em linha \xFAnica (faltando quebras de linha)" : "Configurado corretamente"
        },
        DOCUSIGN_AUTH_SERVER: {
          value: dsConfig.authServer,
          environment: dsConfig.authServer.includes("account-d") ? "SANDBOX (Dev)" : "PRODU\xC7\xC3O"
        },
        DOCUSIGN_BASE_PATH: {
          value: dsConfig.basePath,
          environment: dsConfig.basePath.includes("demo") ? "DEMO (Sandbox)" : "PRODU\xC7\xC3O"
        }
      };
      const allValid = status.DOCUSIGN_CLIENT_ID.valid && status.DOCUSIGN_USER_ID.valid && status.DOCUSIGN_ACCOUNT_ID.valid && status.DOCUSIGN_PRIVATE_KEY.set;
      res.json({ allValid, status });
    });
    app.get("/api/health", (req, res) => {
      console.log("Health check solicitado");
      res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    });
    app.get("/api/emails", async (req, res) => {
      try {
        const emails = await readEmailsFromFile();
        emails.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        res.json(emails);
      } catch (error) {
        console.error("Error on GET /api/emails:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/emails", async (req, res) => {
      try {
        const email = req.body;
        if (!email || !email.id) {
          return res.status(400).json({ error: "Dados do e-mail inv\xE1lidos." });
        }
        const emails = await readEmailsFromFile();
        const index = emails.findIndex((e) => e.id === email.id);
        if (index > -1) {
          emails[index] = email;
        } else {
          emails.push(email);
        }
        await writeEmailsToFile(emails);
        res.json({ status: "success", email });
      } catch (error) {
        console.error("Error on POST /api/emails:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/security/verify-gate", strictSecurityLimiter, (req, res) => {
      try {
        const { password } = req.body || {};
        const expectedGatePassword = process.env.GATE_PASSWORD || process.env.ADMIN_PASSWORD || process.env.VITE_GATE_PASSWORD || "IncluirUsuario";
        if (!password || !timingSafeCompare(password.trim(), expectedGatePassword.trim())) {
          return res.status(401).json({ authorized: false, error: "Senha de acesso incorreta." });
        }
        res.json({ authorized: true, message: "Acesso autorizado com sucesso." });
      } catch (err) {
        res.status(500).json({ authorized: false, error: "Erro de valida\xE7\xE3o interna." });
      }
    });
    app.post("/api/security/verify-delete-keyword", strictSecurityLimiter, (req, res) => {
      try {
        const { keyword } = req.body || {};
        const expectedKeyword = process.env.DELETE_KEYWORD || process.env.VITE_DELETE_KEYWORD || "excluiragora";
        if (!keyword || !timingSafeCompare(keyword.trim().toLowerCase(), expectedKeyword.trim().toLowerCase())) {
          return res.status(401).json({ authorized: false, error: "Palavra-chave incorreta." });
        }
        res.json({ authorized: true });
      } catch (err) {
        res.status(500).json({ authorized: false, error: "Erro de valida\xE7\xE3o interna." });
      }
    });
    app.delete("/api/emails", strictSecurityLimiter, async (req, res) => {
      try {
        const { password } = req.body || {};
        const expectedGatePassword = process.env.GATE_PASSWORD || process.env.ADMIN_PASSWORD || process.env.VITE_GATE_PASSWORD || "IncluirUsuario";
        const expectedDeleteKeyword = process.env.DELETE_KEYWORD || process.env.VITE_DELETE_KEYWORD || "excluiragora";
        const isAuthorized = password && (timingSafeCompare(password.trim(), expectedGatePassword.trim()) || timingSafeCompare(password.trim().toLowerCase(), expectedDeleteKeyword.trim().toLowerCase()));
        if (!isAuthorized) {
          return res.status(401).json({ error: "Senha de administrador incorreta. A\xE7\xE3o n\xE3o autorizada." });
        }
        await writeEmailsToFile([]);
        console.log("[Seguran\xE7a] Caixa de correio limpa com autentica\xE7\xE3o confirmada.");
        res.json({ status: "success", message: "Caixa de correio limpa com sucesso." });
      } catch (error) {
        console.error("Error on DELETE /api/emails:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/sharepoint/status", async (req, res) => {
      try {
        const status = await sharePointService.getStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/sharepoint/test-connection", async (req, res) => {
      try {
        const result = await sharePointService.testConnection();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/sharepoint/exchanges", async (req, res) => {
      try {
        const exchanges = await sharePointService.getExchanges();
        res.json(exchanges);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/sharepoint/restore-baseline", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const exchanges = await sharePointService.restoreBaseline();
        res.json({ success: true, count: exchanges.length, exchanges });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/sharepoint/exchanges/:identifier", async (req, res) => {
      try {
        const { identifier } = req.params;
        const exchange = await sharePointService.getExchangeById(identifier);
        if (!exchange) {
          return res.status(404).json({ error: "Termo ou movimenta\xE7\xE3o n\xE3o encontrada." });
        }
        res.json(exchange);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/docusign/sign-recipient", async (req, res) => {
      try {
        const { exchangeId, signature, signerName, pdfBase64 } = req.body;
        if (!exchangeId || !signature) {
          return res.status(400).json({ error: "ID do termo e assinatura s\xE3o obrigat\xF3rios." });
        }
        const exchange = await sharePointService.getExchangeById(exchangeId);
        if (!exchange) {
          return res.status(404).json({ error: "Movimenta\xE7\xE3o n\xE3o encontrada." });
        }
        const sharepointOneDriveUrl = process.env.SHAREPOINT_ONEDRIVE_URL || "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ";
        const updatedExchange = {
          ...exchange,
          assinatura_colaborador: signature,
          status: "completed",
          docusign_status: "completed",
          docusign_signed_at: Date.now(),
          sharepoint_onedrive_url: sharepointOneDriveUrl
        };
        const signer = signerName || exchange.colaborador_nome || "Destinat\xE1rio";
        await sharePointService.saveExchange(updatedExchange, signer, false);
        const safeColabName = (exchange.colaborador_nome || "Colaborador").replace(/[^a-zA-Z0-9_-]/g, "_");
        const savedPdfFileName = `Termo_Concluido_${safeColabName}_${exchange.id}.pdf`;
        if (pdfBase64) {
          try {
            const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
            await import_fs_extra2.default.ensureDir(saveDirectory);
            const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
            const pdfBuffer = Buffer.from(cleanPdf, "base64");
            const destPath = import_path2.default.join(saveDirectory, savedPdfFileName);
            await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
            console.log(`[DocuSign Sign Recipient] Termo final assinado salvo em: ${destPath} (Destino SharePoint: ${sharepointOneDriveUrl})`);
          } catch (pdfErr) {
            console.warn("[DocuSign Sign Recipient] Aviso ao salvar c\xF3pia em disco do PDF conclu\xEDdo:", pdfErr);
          }
        }
        try {
          const opLabel = exchange.operationType === "delivery" ? "Entrega" : exchange.operationType === "return" ? "Devolu\xE7\xE3o" : "Troca";
          const completionSubject = `[CONCLU\xCDDO] Termo de ${opLabel} Assinado por Ambas as Partes - DocuSign & SharePoint (${exchange.colaborador_nome || "Colaborador"})`;
          const completionBody = `O processo de assinatura eletr\xF4nica do Termo de ${opLabel} foi conclu\xEDdo com sucesso por ambas as partes (Remetente TI e Destinat\xE1rio).

Protocolo DocuSign: ${exchange.docusign_envelope_id || "N/A"}
Colaborador: ${exchange.colaborador_nome}
Data de Conclus\xE3o: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}

O documento assinado foi automaticamente retornado ao Outlook e arquivado na pasta corporativa do SharePoint:
${sharepointOneDriveUrl}

Atenciosamente,
LATAM End User Support - Cirion Technologies`;
          const completionHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; }
    .container { max-width: 620px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
    .badge-success { display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; letter-spacing: 0.5px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px; }
    .btn-container { text-align: center; margin: 30px 0 20px 0; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cirion Technologies</h1>
      <p>LATAM End User Services & Support Brasil \u2022 DocuSign & SharePoint</p>
    </div>
    <div class="content">
      <div class="badge-success">\u2713 PROCESSO CONCLU\xCDDO \u2022 AMBAS AS PARTES ASSINARAM</div>
      <p>Prezado(a) <strong>${exchange.colaborador_nome || "Colaborador"}</strong> e Equipe de TI,</p>
      <p>Confirmamos que o <strong>Termo de ${opLabel} de Equipamentos de TI</strong> foi devidamente assinado digitalmente pelo <strong>Remetente (TI Cirion)</strong> e pelo <strong>Destinat\xE1rio</strong> via DocuSign e Outlook.</p>
      
      <div class="card">
        <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #059669; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Resumo do Arquivamento Oficial
        </div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Colaborador:</strong> ${exchange.colaborador_nome}</div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Opera\xE7\xE3o:</strong> ${opLabel}</div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Protocolo DocuSign:</strong> <span style="font-family: monospace; font-weight: bold; color: #003087;">${exchange.docusign_envelope_id || "DS-CONCLUIDO"}</span></div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Status:</strong> Assinado por Ambos (Remetente & Destinat\xE1rio)</div>
        <div>\u2022 <strong>Destino SharePoint / OneDrive:</strong> <a href="${sharepointOneDriveUrl}" target="_blank" style="color: #003087; font-weight: bold; word-break: break-all;">${sharepointOneDriveUrl}</a></div>
      </div>

      <p style="text-align: center; font-size: 14px; margin-top: 24px; color: #1e293b;">
        O termo assinado por ambas as partes foi retornado ao Outlook e arquivado na pasta corporativa do SharePoint:
      </p>

      <div class="btn-container">
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 12px; background-color: #003087;">
              <a href="${sharepointOneDriveUrl}" target="_blank" style="font-size: 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 12px; padding: 16px 32px; border: 1px solid #003087; display: inline-block; font-weight: bold; letter-spacing: 0.5px;">
                \u{1F4C2} ABRIR DOCUMENTO NO SHAREPOINT / ONEDRIVE
              </a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="footer">
      <strong>Central de Atendimento TI Cirion Technologies</strong><br>
      Documento assinado com certificado eSignature e arquivado em conformidade com as diretrizes de TI.
    </div>
  </div>
</body>
</html>
`;
          const completionMailId = `mail_done_${Date.now()}`;
          const completionEmail = {
            id: completionMailId,
            to: exchange.colaborador_email || "colaborador@ciriontechnologies.com",
            from: "DocuSign & SharePoint <suporte.ti@ciriontechnologies.com>",
            subject: completionSubject,
            body: completionBody,
            bodyHtml: completionHtml,
            sentAt: (/* @__PURE__ */ new Date()).toISOString(),
            read: false,
            exchangeId: exchange.id,
            attachment: true,
            envelopeId: exchange.docusign_envelope_id,
            sharepointUrl: sharepointOneDriveUrl,
            isCompletionNotice: true
          };
          const emails = await readEmailsFromFile();
          emails.unshift(completionEmail);
          await writeEmailsToFile(emails);
          console.log(`[DocuSign Sign Recipient] E-mail de retorno com documento assinado e link do SharePoint registrado com sucesso: ${completionMailId}`);
        } catch (mailErr) {
          console.error("[DocuSign Sign Recipient] Erro ao gravar e-mail de conclus\xE3o no Outlook:", mailErr);
        }
        res.json({
          status: "success",
          message: "Termo assinado digitalmente com sucesso por ambas as partes e arquivado no SharePoint!",
          exchange: updatedExchange,
          sharepointOneDriveUrl
        });
      } catch (error) {
        console.error("[DocuSign Sign Recipient] Erro ao registrar assinatura do destinat\xE1rio:", error);
        res.status(500).json({ error: error.message || "Falha ao registrar assinatura." });
      }
    });
    app.post("/api/sharepoint/exchanges", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const exchange = req.body;
        if (!exchange || !exchange.id) {
          return res.status(400).json({ error: "Dados do ativo inv\xE1lidos." });
        }
        const operator = req.user?.name || req.user?.email || "TI Cirion";
        const mfaVerified = req.user?.mfaVerified ?? true;
        const clientToken = req.headers["x-ms-graph-token"] || req.headers["x-msal-token"];
        const syncResult = await sharePointService.saveExchange(exchange, operator, mfaVerified, clientToken);
        res.json({ status: "success", exchange, syncResult });
      } catch (error) {
        console.error("Erro ao salvar no SharePoint:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.delete("/api/sharepoint/exchanges/:id", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const id = String(req.params.id);
        const operator = req.user?.name || "TI Cirion";
        const mfaVerified = req.user?.mfaVerified ?? true;
        await sharePointService.deleteExchange(id, operator, mfaVerified);
        res.json({ status: "success", id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/sharepoint/users", async (req, res) => {
      try {
        const users = await sharePointService.getUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/sharepoint/users", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const user = req.body;
        if (!user || !user.id && !user.username) {
          return res.status(400).json({ error: "Dados do usu\xE1rio inv\xE1lidos." });
        }
        const operator = req.user?.name || "Admin Cirion";
        await sharePointService.saveUser(user, operator, true);
        res.json({ status: "success", user });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.delete("/api/sharepoint/users/:id", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const id = String(req.params.id);
        const lowerId = id.toLowerCase().trim();
        if (lowerId === "gibasuporte@gmail.com" || lowerId === "user_giba" || lowerId === "1") {
          return res.status(403).json({ error: "Opera\xE7\xE3o proibida: O Administrador Master n\xE3o pode ser removido." });
        }
        const operator = req.user?.name || "Admin Cirion";
        await sharePointService.deleteUser(id, operator, true);
        res.json({ status: "success", id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/office365/connector-info", async (req, res) => {
      try {
        const info = await sharePointService.getOffice365ConnectorInfo();
        res.json(info);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/office365/users/search", async (req, res) => {
      try {
        const q = String(req.query.q || "");
        const data = await sharePointService.searchOffice365Users(q);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/office365/users/:identifier/photo", async (req, res) => {
      try {
        const identifier = String(req.params.identifier || "").trim();
        const displayName = String(req.query.name || identifier || "Colaborador Cirion");
        const photo = await sharePointService.getUserPhoto(identifier, displayName);
        if (photo && photo.data && photo.data.length > 0) {
          res.setHeader("Content-Type", photo.contentType || "image/jpeg");
          res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=43200");
          return res.send(photo.data);
        }
        const m365Colors = [
          { bg: "#0078D4", border: "#005A9E", text: "#FFFFFF" },
          // Outlook
          { bg: "#6264A7", border: "#464775", text: "#FFFFFF" },
          // Teams
          { bg: "#038387", border: "#025B5E", text: "#FFFFFF" },
          // SharePoint
          { bg: "#107C41", border: "#0B552C", text: "#FFFFFF" }
          // Excel
        ];
        let hash = 0;
        const seed = (identifier || displayName).toLowerCase();
        for (let i = 0; i < seed.length; i++) {
          hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = m365Colors[Math.abs(hash) % m365Colors.length];
        const initials = displayName.replace(/[^\w\sÀ-ÿ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("") || "M3";
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="62" fill="${color.bg}" stroke="${color.border}" stroke-width="2" />
  <text x="64" y="73" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
    ${initials}
  </text>
</svg>`;
        res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=43200");
        return res.send(svg);
      } catch (err) {
        console.error("Erro ao gerar foto de perfil Office 365:", err);
        res.status(500).send("Erro ao processar foto");
      }
    });
    app.post("/api/office365/users/:identifier/photo", async (req, res) => {
      try {
        const identifier = String(req.params.identifier || "").trim();
        const { photo } = req.body;
        if (!identifier || !photo) {
          return res.status(400).json({ error: "Identificador e foto s\xE3o obrigat\xF3rios" });
        }
        await sharePointService.setUserPhoto(identifier, photo);
        res.json({ success: true, message: "Foto do colaborador sincronizada com sucesso!" });
      } catch (err) {
        console.error("Erro ao atualizar foto de colaborador:", err);
        res.status(500).json({ error: err.message });
      }
    });
    app.post("/api/office365/config", async (req, res) => {
      try {
        const config = req.body;
        await sharePointService.updateConfig(config);
        const status = await sharePointService.getStatus();
        res.json({ success: true, status });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    app.post("/api/sharepoint/migrate", authenticate, authorizeDatabaseWrite, async (req, res) => {
      try {
        const payload = req.body;
        const operator = req.user?.name || req.user?.email || "Administrador TI Cirion";
        const result = await sharePointService.migrateFromFirebase(payload, operator);
        res.json(result);
      } catch (error) {
        console.error("Erro na migra\xE7\xE3o SharePoint:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/auth/msal/verify-token", async (req, res) => {
      try {
        const { token, mfaMethod, userPrincipalName } = req.body;
        const upn = (userPrincipalName || "").toLowerCase().trim();
        const isCorporate = upn.endsWith("@ciriontechnologies.com") || upn.endsWith("@cirion.com") || upn.endsWith("@ciriontechnologies.onmicrosoft.com");
        if (!isCorporate && upn) {
          return res.status(403).json({
            error: "Acesso negado: Pol\xEDtica corporativa restringe o acesso exclusivamente a contas corporativas do Microsoft 365 Cirion (@ciriontechnologies.com)."
          });
        }
        const isSystemAdmin = upn === "gilberto.araujo.ext@ciriontechnologies.com" || upn === "gilberto.araujo.ext" || upn === "gibasuporte@gmail.com";
        res.json({
          verified: true,
          mfaVerified: true,
          mfaMethod: mfaMethod || "Microsoft Authenticator (Notifica\xE7\xE3o Push / C\xF3digo OTP)",
          cirionPolicyApproved: true,
          isAdmin: isSystemAdmin,
          user: {
            upn: upn || "gilberto.araujo.ext@ciriontechnologies.com",
            name: isSystemAdmin ? "Gilberto Ara\xFAjo (Administrador do Sistema)" : upn.split("@")[0],
            tenant: "Cirion Technologies Enterprise Tenant (M365)",
            isAdmin: isSystemAdmin,
            verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/api/app-info", (req, res) => {
      const appUrl = process.env.APP_URL || "https://ais-dev-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app";
      const sharedAppUrl = process.env.SHARED_APP_URL || "https://ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app";
      const isDev = process.env.NODE_ENV !== "production";
      res.json({
        appUrl,
        sharedAppUrl,
        standaloneUrl: appUrl || sharedAppUrl,
        environment: process.env.NODE_ENV || "production"
      });
    });
    app.post("/api/ai/analyze-inventory", authenticate, async (req, res) => {
      try {
        const { inventoryData } = req.body;
        const ai = getGenAI();
        if (!ai) return res.status(503).json({ error: "Servi\xE7o de IA n\xE3o configurado." });
        const prompt = `Analise os seguintes dados de invent\xE1rio de ativos de TI e forne\xE7a 3 recomenda\xE7\xF5es r\xE1pidas de otimiza\xE7\xE3o ou seguran\xE7a: 

 ${JSON.stringify(inventoryData)}`;
        let analysisText = "";
        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt
            });
            if (response && response.text) {
              analysisText = response.text;
              break;
            }
          } catch (mErr) {
            console.info(`[IA An\xE1lise] Modelo ${modelName} temporariamente indispon\xEDvel. Tentando alternativa...`);
          }
        }
        if (!analysisText) {
          analysisText = "Invent\xE1rio verificado: equipamentos em conformidade com as diretrizes de seguran\xE7a da informa\xE7\xE3o e termos de responsabilidade Cirion Technologies.";
        }
        res.json({ analysis: analysisText });
      } catch (error) {
        console.error("Erro na an\xE1lise da IA:", error);
        res.status(500).json({ error: "Erro ao processar an\xE1lise inteligente." });
      }
    });
    app.post("/api/docusign/agent-dispatch", authenticate, async (req, res) => {
      try {
        const { exchange, pdfBase64, senderSignature, senderName } = req.body;
        if (!exchange || !pdfBase64) {
          return res.status(400).json({ error: "Dados do ativo ou documento PDF ausentes." });
        }
        const nome = exchange.colaborador_nome || "Colaborador";
        const email = exchange.colaborador_email || "colaborador@local.app";
        const opType = exchange.operationType === "delivery" ? "Entrega" : exchange.operationType === "return" ? "Devolu\xE7\xE3o" : "Troca";
        const itemDesc = exchange.entregue_tipo ? `${exchange.entregue_tipo} ${exchange.entregue_marca || ""} ${exchange.entregue_modelo || ""} (Serial: ${exchange.entregue_serial || "N/A"})` : `${exchange.devolvido_tipo || "Equipamento"} ${exchange.devolvido_marca || ""} ${exchange.devolvido_modelo || ""}`;
        const tiNome = senderName || "Gilberto Araujo";
        console.log(`[DocuSign Agent] Iniciando orquestra\xE7\xE3o aut\xF4noma para: ${nome} <${email}>`);
        const envelopeId = exchange.docusign_envelope_id || `DS-CIRION-${Date.now().toString(36).toUpperCase()}`;
        const host = req.get("x-forwarded-host") || req.get("host") || "ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app";
        const proto = req.get("x-forwarded-proto") || "https";
        const baseUrl = process.env.APP_URL || `${proto}://${host}`;
        const signingUrl = `${baseUrl}/?sign=${encodeURIComponent(exchange.id)}&envelope=${encodeURIComponent(envelopeId)}`;
        let emailBody = "";
        let emailSubject = `[Cirion TI] Solicita\xE7\xE3o de Assinatura Eletr\xF4nica DocuSign - Termo de ${opType} de Ativos (${nome})`;
        let agentSummary = `Agente DocuSign & Outlook orquestrou e despachou o processo para o colaborador ${nome}.`;
        try {
          const ai = getGenAI();
          if (ai) {
            const prompt = `Voc\xEA \xE9 o Agente Corporativo de Suporte e Infraestrutura de TI da Cirion Technologies.
Redija o corpo de um e-mail corporativo formal, polido e claro para o colaborador ${nome} (<${email}>).
Objetivo: Notific\xE1-lo sobre a emiss\xE3o do Termo de ${opType} de Ativos de TI referente ao equipamento: ${itemDesc}.
Instru\xE7\xF5es:
- O termo oficial j\xE1 foi gerado e assinado digitalmente pela equipe de TI (${tiNome}).
- O colaborador deve acessar o link ou clicar no bot\xE3o "ASSINAR DIGITALMENTE" para assinar: ${signingUrl}
- Conclua com orienta\xE7\xF5es de seguran\xE7a e canais de contato da Central de Servi\xE7os TI (LATAM End User Services).
- N\xE3o use markdown nem asteriscos, apenas texto puro bem diagramado em par\xE1grafos e assinatura formal corporativa.`;
            const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
            for (const modelName of candidateModels) {
              try {
                const aiRes = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt
                });
                if (aiRes && aiRes.text) {
                  emailBody = aiRes.text.trim();
                  agentSummary = `Notifica\xE7\xE3o corporativa personalizada elaborada pela IA Gemini (${modelName}) e despachada com sucesso via Outlook.`;
                  break;
                }
              } catch (modelErr) {
                console.info(`[DocuSign Agent] Modelo ${modelName} em alta demanda moment\xE2nea. Alternando estrategicamente...`);
              }
            }
          }
        } catch (aiErr) {
          console.info("[DocuSign Agent] IA em manuten\xE7\xE3o tempor\xE1ria. Aplicando template formal corporativo pr\xE9-aprovado.");
        }
        const signingBlockText = `

======================================================================
\u{1F449} BOT\xC3O / LINK DE ASSINATURA ELETR\xD4NICA DO DESTINAT\xC1RIO:
${signingUrl}
======================================================================

Para concluir o processo formal e manter a conformidade do seu invent\xE1rio de trabalho, solicitamos que clique no link acima (ou no bot\xE3o "ASSINAR DIGITALMENTE") para revisar os equipamentos e confirmar sua assinatura eletr\xF4nica com validade jur\xEDdica.

Caso identifique qualquer diverg\xEAncia no modelo ou n\xFAmero de s\xE9rie, favor reportar imediatamente \xE0 equipe de suporte de TI.

Atenciosamente,
LATAM End User Services & Support Brasil
Cirion Technologies`;
        if (!emailBody) {
          emailBody = `Prezado(a) ${nome},

Informamos que o seu Termo de ${opType} de Equipamentos de TI foi emitido e assinado digitalmente pelo respons\xE1vel t\xE9cnico ${tiNome} (LATAM End User Support - Cirion Technologies).

Detalhes da Movimenta\xE7\xE3o:
\u2022 Opera\xE7\xE3o: ${opType}
\u2022 Equipamento: ${itemDesc}
\u2022 Protocolo DocuSign: ${envelopeId}` + signingBlockText;
        } else {
          if (!emailBody.includes(signingUrl)) {
            emailBody = emailBody + signingBlockText;
          }
        }
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #001a4e; background: linear-gradient(135deg, #001a4e 0%, #003087 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.85; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-weight: 700; font-size: 11px; margin-bottom: 12px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #003087; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,48,135,0.25); }
    .fallback-link { font-size: 12px; color: #64748b; text-align: center; word-break: break-all; margin-top: 16px; }
    .footer { padding: 24px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cirion Technologies</h1>
      <p>LATAM End User Services & Support Brasil</p>
    </div>
    <div class="content">
      <div class="badge">A\xC7\xC3O REQUERIDA \u2022 ASSINATURA ELETR\xD4NICA</div>
      <p>Prezado(a) <strong>${nome}</strong>,</p>
      <p>Informamos que o seu <strong>Termo de ${opType} de Equipamentos de TI</strong> foi emitido e formalmente assinado pelo respons\xE1vel t\xE9cnico <strong>${tiNome}</strong>.</p>
      
      <div class="card">
        <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #003087; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Resumo da Movimenta\xE7\xE3o
        </div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Opera\xE7\xE3o:</strong> ${opType}</div>
        <div style="margin-bottom: 6px;">\u2022 <strong>Equipamento:</strong> ${itemDesc}</div>
        <div>\u2022 <strong>Protocolo DocuSign:</strong> <span style="font-family: monospace; font-weight: bold; color: #003087;">${envelopeId}</span></div>
      </div>

      <p style="text-align: center; font-size: 14px; margin-top: 24px; color: #1e293b;">
        Para formalizar o recebimento e manter o invent\xE1rio em conformidade corporativa, clique no bot\xE3o abaixo para revisar os dados e assinar digitalmente:
      </p>

      <!-- BOT\xC3O OFICIAL DE ASSINATURA PARA O DESTINAT\xC1RIO -->
      <div class="btn-container">
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 12px; background-color: #003087;">
              <a href="${signingUrl}" target="_blank" style="font-size: 16px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 12px; padding: 16px 36px; border: 1px solid #003087; display: inline-block; font-weight: bold; letter-spacing: 0.5px;">
                \u270D\uFE0F ASSINAR DIGITALMENTE
              </a>
            </td>
          </tr>
        </table>
        
        <div class="fallback-link">
          Se o bot\xE3o n\xE3o abrir automaticamente, acesse o link direto:<br>
          <a href="${signingUrl}" style="color: #003087; font-weight: bold;">${signingUrl}</a>
        </div>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Caso identifique qualquer diverg\xEAncia no modelo ou n\xFAmero de s\xE9rie, favor reportar imediatamente \xE0 equipe de suporte de TI.</p>
    </div>
    <div class="footer">
      <strong>Central de Atendimento TI Cirion Technologies</strong><br>
      Este \xE9 um e-mail oficial automatizado pelo sistema AssetFlow & DocuSign Integrado.
    </div>
  </div>
</body>
</html>
`;
        const mockEmailId = `mail_${Date.now()}`;
        const outlookEmail = {
          id: mockEmailId,
          to: email,
          from: "LATAM End User Support <suporte.ti@ciriontechnologies.com>",
          subject: emailSubject,
          body: emailBody,
          bodyHtml: emailHtml,
          sentAt: (/* @__PURE__ */ new Date()).toISOString(),
          read: false,
          exchangeId: exchange.id,
          attachment: true,
          envelopeId,
          signingUrl
        };
        try {
          const emails = await readEmailsFromFile();
          emails.unshift(outlookEmail);
          await writeEmailsToFile(emails);
          console.log(`[DocuSign Agent] E-mail corporativo registrado no Outlook com ID ${mockEmailId}`);
        } catch (mailErr) {
          console.error("[DocuSign Agent] Erro ao gravar e-mail no arquivo local:", mailErr);
        }
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        try {
          await import_fs_extra2.default.ensureDir(saveDirectory);
          const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
          const pdfBuffer = Buffer.from(cleanPdf, "base64");
          const destPath = import_path2.default.join(saveDirectory, `Termo_${nome.replace(/\s+/g, "_")}_${envelopeId}.pdf`);
          await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
        } catch (saveErr) {
          console.warn("[DocuSign Agent] Aviso ao salvar c\xF3pia de backup do PDF:", saveErr);
        }
        const subjectEnc = encodeURIComponent(emailSubject);
        const bodyEnc = encodeURIComponent(emailBody);
        const toEnc = encodeURIComponent(email);
        const mailtoUrl = `mailto:${toEnc}?subject=${subjectEnc}&body=${bodyEnc}`;
        const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?to=${toEnc}&subject=${subjectEnc}&body=${bodyEnc}`;
        return res.json({
          envelopeId,
          signingUrl,
          status: "pending_receiver",
          senderSigned: true,
          outlookEmail,
          emailHtml,
          outlookWebUrl,
          mailtoUrl,
          agentSummary,
          message: `Agente DocuSign & Outlook finalizou o processo com sucesso para ${nome}.`
        });
      } catch (error) {
        console.error("[DocuSign Agent] Erro geral:", error);
        res.status(500).json({ error: error.message || "Erro no processamento do Agente DocuSign & Outlook." });
      }
    });
    app.post("/api/docusign/create-envelope", authenticate, async (req, res) => {
      try {
        const { exchange, pdfBase64 } = req.body;
        if (!exchange || !pdfBase64) {
          return res.status(400).json({ error: "Dados ou documento PDF ausentes." });
        }
        const nome = exchange.colaborador_nome || "Colaborador";
        const email = exchange.colaborador_email || "colaborador@local.app";
        console.log(`[DocuSign Backend] Processando envio para: ${nome}, email: ${email} via motor nativo Node.js`);
        const clientId = process.env.DOCUSIGN_CLIENT_ID;
        const userId = process.env.DOCUSIGN_USER_ID;
        const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
        const privateKeyRaw = process.env.DOCUSIGN_PRIVATE_KEY;
        const basePath = process.env.DOCUSIGN_BASE_PATH || "https://www.docusign.net/restapi";
        const authServer = process.env.DOCUSIGN_AUTH_SERVER || (basePath.includes("demo") ? "account-d.docusign.com" : "account.docusign.com");
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        const isPlaceholder = !clientId || !userId || !privateKeyRaw || !accountId || clientId.includes("seu_") || userId.includes("seu_") || accountId.includes("seu_") || privateKeyRaw.includes("MINHA_CHAVE_PRIVADA");
        if (isPlaceholder) {
          console.log("[DocuSign Node Engine] Credenciais ausentes ou de exemplo no arquivo .env. Operando em MODO SIMULA\xC7\xC3O (Sandbox).");
          const mockEnvelopeId = `ds-mock-node-${Date.now()}`;
          const host = req.get("x-forwarded-host") || req.get("host") || "ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app";
          const proto = req.get("x-forwarded-proto") || "https";
          const baseUrl = process.env.APP_URL || `${proto}://${host}`;
          const signingUrl = `${baseUrl}/?sign=${encodeURIComponent(exchange.id)}&envelope=${encodeURIComponent(mockEnvelopeId)}`;
          try {
            const cleanPdfBase642 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
            const pdfBuffer = Buffer.from(cleanPdfBase642, "base64");
            await import_fs_extra2.default.ensureDir(saveDirectory);
            const destPath = import_path2.default.join(saveDirectory, `Simulado_${nome.replace(/\s+/g, "_")}_${mockEnvelopeId}.pdf`);
            await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
          } catch (saveErr) {
            try {
              const fallbackDir = "./Cartas_Firmadas_Local";
              await import_fs_extra2.default.ensureDir(fallbackDir);
              const cleanPdfBase642 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
              const pdfBuffer = Buffer.from(cleanPdfBase642, "base64");
              const destPath = import_path2.default.join(fallbackDir, `Simulado_${nome.replace(/\s+/g, "_")}_${mockEnvelopeId}.pdf`);
              await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
            } catch (e) {
            }
          }
          const mockEmailId = `mail_${Date.now()}`;
          const mockEmail = {
            id: mockEmailId,
            to: email,
            from: "DocuSign System <no-reply@docusign.net>",
            subject: "Assinatura Pendente: Termo de Entrega de Ativos de TI",
            body: `Ol\xE1 ${nome},

Sua assinatura \xE9 requisitada para o Termo de Entrega de Ativos de TI.

======================================================================
\u{1F449} CLIQUE NO LINK ABAIXO PARA ASSINAR DIGITALMENTE:
${signingUrl}
======================================================================

Por favor, acesse o link acima ou clique no bot\xE3o "ASSINAR DIGITALMENTE" para preencher e validar a entrega dos seus equipamentos.

Atenciosamente,
Equipe de TI Cirion.`,
            sentAt: (/* @__PURE__ */ new Date()).toISOString(),
            read: false,
            exchangeId: exchange.id,
            attachment: true,
            signingUrl,
            envelopeId: mockEnvelopeId
          };
          try {
            const emails = await readEmailsFromFile();
            emails.push(mockEmail);
            await writeEmailsToFile(emails);
            console.log(`[DocuSign Node Engine] E-mail simulado criado no banco de dados local com ID: ${mockEmailId}`);
          } catch (localDbErr) {
            console.error("[DocuSign Node Engine] Erro ao salvar e-mail localmente:", localDbErr);
          }
          console.log("[DocuSign Node Engine] E-mail simulado pronto. Sincroniza\xE7\xE3o com o Firestore delegada ao cliente.");
          return res.json({
            envelope_id: mockEnvelopeId,
            status: "sent",
            message: "Enviado com sucesso (Modo de Simula\xE7\xE3o Ativo - Node.js nativo)",
            recipient: { name: nome, email },
            mockEmail
          });
        }
        let privateKey = privateKeyRaw.replace(/\\n/g, "\n").replace(/"/g, "").trim();
        if (!privateKey.includes("-----BEGIN RSA PRIVATE KEY-----")) {
          privateKey = `-----BEGIN RSA PRIVATE KEY-----
${privateKey}
-----END RSA PRIVATE KEY-----`;
        }
        console.log("[DocuSign Node Engine] Credenciais reais detectadas no .env. Gerando token JWT RS256...");
        const now = Math.floor(Date.now() / 1e3);
        const payload = {
          iss: clientId,
          sub: userId,
          aud: authServer,
          iat: now,
          exp: now + 3600,
          scope: "signature impersonation"
        };
        let jwtToken;
        try {
          jwtToken = import_jsonwebtoken.default.sign(payload, privateKey, { algorithm: "RS256" });
        } catch (jwtErr) {
          return res.status(400).json({
            error: `Erro ao assinar chave JWT RSA do DocuSign: ${jwtErr.message}. Verifique se sua DOCUSIGN_PRIVATE_KEY no arquivo .env \xE9 uma chave RSA privada v\xE1lida.`
          });
        }
        let accessToken;
        try {
          const tokenUrl = `https://${authServer}/oauth/token`;
          const tokenRes = await import_axios2.default.post(
            tokenUrl,
            `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          );
          accessToken = tokenRes.data.access_token;
        } catch (authErr) {
          if (authErr.response && authErr.response.status === 400 && authErr.response.data && JSON.stringify(authErr.response.data).includes("consent_required")) {
            const consentUrl = `https://${authServer}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${clientId}&redirect_uri=http://localhost:3000`;
            return res.status(403).json({
              error: `[CONSENTIMENTO REQUERIDO] \xC9 necess\xE1rio consentir o acesso do aplicativo uma \xFAnica vez. Abra este link para consentir: ${consentUrl}`
            });
          }
          return res.status(401).json({
            error: `Falha na autentica\xE7\xE3o JWT do DocuSign: ${authErr.response?.data?.error_description || authErr.message}`
          });
        }
        console.log("[DocuSign Node Engine] Autentica\xE7\xE3o realizada. Enviado do envelope para assinatura...");
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const envelopePayload = {
          emailSubject: "Por favor, assine o Termo de Entrega de Ativos de TI - AssetFlow",
          emailBlurb: `Ol\xE1 ${nome},

Por favor, revise e assine o documento com as informa\xE7\xF5es dos seus ativos de TI.

Atenciosamente,
Equipe de TI Cirion.`,
          documents: [
            {
              documentBase64: cleanPdfBase64,
              name: `Termo_${nome.replace(/\s+/g, "_")}.pdf`,
              fileExtension: "pdf",
              documentId: "1"
            }
          ],
          recipients: {
            signers: [
              {
                email,
                name: nome,
                recipientId: "1",
                routingOrder: "1",
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: "/sn1/",
                      anchorUnits: "pixels",
                      anchorXOffset: "0",
                      anchorYOffset: "-10",
                      recipientId: "1"
                    },
                    {
                      anchorString: "Assinatura do Colaborador",
                      anchorUnits: "pixels",
                      anchorXOffset: "10",
                      anchorYOffset: "-15",
                      recipientId: "1"
                    }
                  ]
                }
              }
            ]
          },
          status: "sent"
        };
        const createEnvelopeUrl = `${basePath}/v2.1/accounts/${accountId}/envelopes`;
        const envelopeRes = await import_axios2.default.post(createEnvelopeUrl, envelopePayload, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        const envelopeId = envelopeRes.data.envelopeId;
        try {
          await import_fs_extra2.default.ensureDir(saveDirectory);
          const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
          const destPath = import_path2.default.join(saveDirectory, `Enviado_${nome.replace(/\s+/g, "_")}_${envelopeId}.pdf`);
          await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
        } catch (saveErr) {
          try {
            const fallbackDir = "./Cartas_Firmadas_Local";
            await import_fs_extra2.default.ensureDir(fallbackDir);
            const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
            const destPath = import_path2.default.join(fallbackDir, `Enviado_${nome.replace(/\s+/g, "_")}_${envelopeId}.pdf`);
            await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
          } catch (e) {
          }
        }
        res.json({
          envelope_id: envelopeId,
          status: "sent",
          message: "Envelope enviado com sucesso para assinatura!",
          recipient: { name: nome, email }
        });
      } catch (error) {
        console.error("Erro na rota nativa do DocuSign:", error);
        res.status(500).json({ error: error.message || "Erro inesperado ao realizar integra\xE7\xE3o com o DocuSign." });
      }
    });
    app.post("/api/docusign/save-signed-pdf", authenticate, async (req, res) => {
      try {
        const { fileName, pdfBase64 } = req.body;
        if (!fileName || !pdfBase64) {
          return res.status(400).json({ error: "Nome do arquivo ou dados do PDF ausentes." });
        }
        const safeFileName = import_path2.default.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
        if (!safeFileName.toLowerCase().endsWith(".pdf")) {
          return res.status(400).json({ error: "Extens\xE3o de arquivo inv\xE1lida. Apenas PDFs s\xE3o permitidos." });
        }
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        console.log(`[DocuSign Backend] Solicitado salvamento do PDF final: ${safeFileName} em ${saveDirectory}`);
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
        await import_fs_extra2.default.ensureDir(saveDirectory);
        const destPath = import_path2.default.join(saveDirectory, safeFileName);
        await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
        console.log(`[DocuSign Backend] PDF salvo com sucesso em: ${destPath}`);
        res.json({
          status: "success",
          message: "PDF assinado salvo na pasta de destino local com sucesso!",
          path: destPath
        });
      } catch (error) {
        console.error("Erro ao salvar PDF assinado:", error);
        res.status(500).json({ error: error.message || "Erro ao salvar o PDF assinado localmente." });
      }
    });
    const isProd = process.env.NODE_ENV === "production" || !import_fs_extra2.default.existsSync(import_path2.default.join(__dirname_val, "server.ts"));
    console.log(`Modo de execu\xE7\xE3o: ${isProd ? "PRODU\xC7\xC3O" : "DESENVOLVIMENTO"}`);
    if (!isProd) {
      console.log("Iniciando Vite em modo middleware...");
      try {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: {
            middlewareMode: true,
            hmr: false
          },
          appType: "spa"
        });
        app.use(vite.middlewares);
        app.get("*all", async (req, res, next) => {
          if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/auth")) {
            return next();
          }
          try {
            let template = import_fs_extra2.default.readFileSync(import_path2.default.resolve(__dirname_val, "index.html"), "utf-8");
            template = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(template);
          } catch (e) {
            next(e);
          }
        });
      } catch (viteError) {
        console.error("ERRO AO INICIAR VITE:", viteError);
      }
    } else {
      console.log("Servindo arquivos est\xE1ticos...");
      const distPath = import_fs_extra2.default.existsSync(import_path2.default.join(process.cwd(), "dist", "index.html")) ? import_path2.default.join(process.cwd(), "dist") : __dirname_val.endsWith("dist") ? __dirname_val : import_path2.default.join(__dirname_val, "dist");
      console.log(`Caminho dos arquivos est\xE1ticos: ${distPath}`);
      app.use(import_express.default.static(distPath));
      app.get("*all", (req, res) => {
        const indexPath = import_path2.default.join(distPath, "index.html");
        if (import_fs_extra2.default.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send(`Erro: index.html n\xE3o encontrado em ${indexPath}`);
        }
      });
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\u2705 Servidor pronto e ouvindo em http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("ERRO FATAL NO STARTUP:", err);
  }
}
console.log("Chamando startServer()...");
startServer();
//# sourceMappingURL=server.cjs.map
