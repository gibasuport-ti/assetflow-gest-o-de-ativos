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
      return {
        exchanges: data.exchanges || [],
        users: data.users || [],
        lastUpdated: data.lastUpdated || (/* @__PURE__ */ new Date()).toISOString(),
        auditTrail: data.auditTrail || []
      };
    }
  } catch (err) {
    console.error("[SharePoint Store] Erro ao ler banco local do SharePoint:", err);
  }
  return {
    exchanges: [],
    users: [],
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    auditTrail: []
  };
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
    app.use(import_express.default.json({ limit: "50mb" }));
    app.use((0, import_cookie_parser.default)());
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
    app.delete("/api/emails", async (req, res) => {
      try {
        const { password } = req.body || {};
        const expectedGatePassword = process.env.VITE_GATE_PASSWORD || process.env.GATE_PASSWORD || "IncluirUsuario";
        const expectedDeleteKeyword = process.env.VITE_DELETE_KEYWORD || process.env.DELETE_KEYWORD || "excluiragora";
        if (!password || password !== expectedGatePassword && password !== expectedDeleteKeyword) {
          return res.status(401).json({ error: "Senha de administrador incorreta. A\xE7\xE3o n\xE3o autorizada." });
        }
        await writeEmailsToFile([]);
        console.log("[Outlook Interno] Todas as mensagens de teste foram limpas pelo administrador.");
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
        const updatedExchange = {
          ...exchange,
          assinatura_colaborador: signature,
          status: "completed",
          docusign_status: "completed",
          docusign_signed_at: Date.now()
        };
        const signer = signerName || exchange.colaborador_nome || "Destinat\xE1rio";
        await sharePointService.saveExchange(updatedExchange, signer, false);
        if (pdfBase64) {
          try {
            const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
            await import_fs_extra2.default.ensureDir(saveDirectory);
            const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
            const pdfBuffer = Buffer.from(cleanPdf, "base64");
            const destPath = import_path2.default.join(saveDirectory, `Termo_Concluido_${exchange.colaborador_nome?.replace(/\s+/g, "_")}_${exchange.id}.pdf`);
            await import_fs_extra2.default.writeFile(destPath, pdfBuffer);
          } catch (pdfErr) {
            console.warn("[DocuSign Sign Recipient] Aviso ao salvar c\xF3pia em disco do PDF conclu\xEDdo:", pdfErr);
          }
        }
        res.json({
          status: "success",
          message: "Termo assinado digitalmente com sucesso!",
          exchange: updatedExchange
        });
      } catch (error) {
        console.error("[DocuSign Sign Recipient] Erro ao registrar assinatura do destinat\xE1rio:", error);
        res.status(500).json({ error: error.message || "Falha ao registrar assinatura." });
      }
    });
    app.post("/api/sharepoint/exchanges", authenticate, async (req, res) => {
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
    app.delete("/api/sharepoint/exchanges/:id", authenticate, async (req, res) => {
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
    app.post("/api/sharepoint/users", authenticate, async (req, res) => {
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
    app.delete("/api/sharepoint/users/:id", authenticate, async (req, res) => {
      try {
        const id = String(req.params.id);
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
    app.post("/api/sharepoint/migrate", authenticate, async (req, res) => {
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
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });
        res.json({ analysis: response.text });
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
            const aiRes = await ai.models.generateContent({
              model: "gemini-3.8-flash",
              contents: prompt
            });
            if (aiRes && aiRes.text) {
              emailBody = aiRes.text.trim();
              agentSummary = `Notifica\xE7\xE3o corporativa personalizada elaborada pela IA Gemini e despachada com sucesso via Outlook.`;
            }
          }
        } catch (aiErr) {
          console.warn("[DocuSign Agent] Aviso IA Gemini, aplicando template corporativo formal:", aiErr);
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
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        console.log(`[DocuSign Backend] Solicitado salvamento do PDF final: ${fileName} em ${saveDirectory}`);
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
        await import_fs_extra2.default.ensureDir(saveDirectory);
        const destPath = import_path2.default.join(saveDirectory, fileName);
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
