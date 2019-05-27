import { query, sparqlEscapeUri, sparqlEscapeString } from 'mu';

const EXT_PREFIX = 'ext: <http://mu.semte.ch/vocabularies/ext/>';
const TOEZICHT_PREFIX = 'toezicht: <http://mu.semte.ch/vocabularies/ext/supervision/>';
const ADMS_PREFIX = 'adms: <http://www.w3.org/ns/adms#>';
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

async function setReadyToBeCachedStatus(fileAddress) {
  console.log(fileAddress.uri.value);
  let q = `
    PREFIX ${EXT_PREFIX}
    PREFIX ${TOEZICHT_PREFIX}
    PREFIX ${ADMS_PREFIX}

    INSERT {
      GRAPH ${sparqlEscapeUri(PUBLIC_GRAPH)} {
        ${sparqlEscapeUri(fileAddress.uri.value)} ext:fileAddressCacheStatus ?fileAddressCacheStatus .
      }
    }
    WHERE {
      GRAPH ${sparqlEscapeUri(PUBLIC_GRAPH)} {
        ?fileAddressCacheStatus a ext:fileAddressCacheStatus ;
          ext:fileAddressCacheStatusLabel ${sparqlEscapeString(READY_TO_BE_CACHED)} .
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


export { fetchLinksToBeCached, setReadyToBeCachedStatus }
