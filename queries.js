import { query, sparqlEscapeUri, sparqlEscapeString, uuid } from 'mu';

const EXT_PREFIX = 'ext: <http://mu.semte.ch/vocabularies/ext/>';
const TOEZICHT_PREFIX = 'toezicht: <http://mu.semte.ch/vocabularies/ext/supervision/>';
const ADMS_PREFIX = 'adms: <http://www.w3.org/ns/adms#>';
const DOWNLOAD_PREFIX = 'download: <http://mu.semte.ch/vocabularies/ext/download/>';
const TMO_PREFIX = 'tmo: <http://www.semanticdesktop.org/ontologies/2008/05/20/tmo#>';
const READY_TO_BE_CACHED = 'ready-to-be-cached';
const PUBLIC_GRAPH = 'http://mu.semte.ch/graphs/public';

async function fetchLinksToBeCached() {
  let q = `
    PREFIX ${EXT_PREFIX}
    PREFIX ${TOEZICHT_PREFIX}
    PREFIX ${ADMS_PREFIX}

    SELECT DISTINCT ?uri ?url {
      ?s toezicht:fileAddress ?uri ;
        adms:status <http://data.lblod.info/document-statuses/verstuurd> .

      ?uri ext:fileAddress ?url .

      OPTIONAL {
        ?uri ext:fileAddressCacheStatus ?statusUri .
      }

      FILTER ( !BOUND(?statusUri) )
    }
  `;

  let qResults = [];
  try {
    qResults = await query(q);
  } catch (err) {
    console.log(`Error while querying the list of fileAddresses`)
    console.log(err);
  }

  return qResults.results.bindings || [];
};

async function createDownloadTask(fileAddress) {
  let q = `
    PREFIX ${EXT_PREFIX}
    PREFIX ${DOWNLOAD_PREFIX}
    PREFIX ${TMO_PREFIX}

    INSERT {
      GRAPH ${sparqlEscapeUri(PUBLIC_GRAPH)} {
        ?task a download:DownloadTask .
        ?task download:httpStatus <http://data.lblod.info/id/download-task-statuses/not-started> .
        ?task tmo:taskSource ${sparqlEscapeUri(fileAddress.uri.value)} .
      }
    }
    WHERE {
      GRAPH ${sparqlEscapeUri(PUBLIC_GRAPH)} {
        BIND(IRI(CONCAT("http://data.lblod.info/id/download-tasks/", "${(uuid())}")) AS ?task)
      }
    }
  `;

  let qResults = [];
  try {
    qResults = await query(q);
  } catch (err) {
    console.log(`Error while querying the list of fileAddresses`)
    console.log(err);
  }
};


export { fetchLinksToBeCached, createDownloadTask }
