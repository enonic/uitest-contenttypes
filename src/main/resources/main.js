const projectLib = require('/lib/xp/project');
const contextLib = require('/lib/xp/context');
const exportLib = require('/lib/xp/export');
const mustache = require('/lib/mustache');

const projectData = {
    id: 'default',
    displayName: 'Default',
    description: 'Test data for ui-testing',   
    readAccess: {
        public: true
    }
}

function runInContext(callback) {
    let result;
    try {
        result = contextLib.run({
            principals: ["role:system.admin"],
            repository: 'com.enonic.cms.' + projectData.id,
            branch: 'draft',
        }, callback);
    } catch (e) {
        log.info(`Error@: ${e.message}`   +  e);
    }
    log.info('Contenttypes@ -  runInContext@ '  + result!=null);
    log.info('Contenttypes@ -  runInContext@ '  + result!=null);
    return result;
}

function createProject() {
    return projectLib.create(projectData);
}

function getProject() {
    return projectLib.get({
        id: projectData.id
    });
}


function initializeProject() {
    let project = runInContext(getProject);
    log.info('########## Checking of existing Default project, initializeProject'  + project!=null);
    if (!project) {
        log.info('Project "' + projectData.id + '" not found. Creating...');
        project = runInContext(createProject);
        log.info('Project @@@ "' + projectData + '" runInContext method is completed');

        if (project) {
            log.info('Project "' + projectData.id + '" ###### successfully created');

            log.info('Importing "' + projectData.id + '" data');
            runInContext(createContent);
        } else {
            log.error('Project "' + projectData.id + '" failed to be created!!!!');
        }
    }
}

function createContent() {
    let importNodes = exportLib.importNodes({
        source: resolve('/import'),
        targetNodePath: '/content',
        xslt: resolve('/import/replace_app.xsl'),
        xsltParams: {
            applicationId: app.name
        },
        includeNodeIds: true
    });
    log.info('-------------------');
    log.info('Content Types, ##########Test-Data############Imported nodes:');
    importNodes.addedNodes.forEach(element => log.info(element));
    log.info('-------------------');
    log.info('Updated nodes:');
    importNodes.updatedNodes.forEach(element => log.info(element));
    log.info('-------------------');
    log.info('Imported binaries:');
    importNodes.importedBinaries.forEach(element => log.info(element));
    log.info('-------------------');
    if (importNodes.importErrors.length !== 0) {
        log.warning('Errors:');
        importNodes.importErrors.forEach(element => log.warning(element.message));
        log.info('-------------------');
    }
}
initializeProject();

exports.get = function (req) {

    var view = resolve('main.html');
    var params = {
        appId: app.name,
        title: 'Test controller'
    };

    return {
        body: mustache.render(view, params),
        contentType: 'text/html'
    };
};

// Handles a POST request
exports.post = function (req) {

    // var name = request.params.name;

    var view = resolve('main.html');
    var params = {
        appId: app.name,
        title: 'Test controller'
    };

    return {
        body: mustache.render(view, params),
        contentType: 'text/html'
    };
};

// Handles all other method requests
exports.all = function (req) {
    if (req.method === 'DELETE') {
        handleDelete(req);
    } else if (req.method === 'PUT') {
        handlePut(req);
    }

    return {
        body: {'Hello': name, 'Method': req.method},
        contentType: 'application/json'
    };
};

