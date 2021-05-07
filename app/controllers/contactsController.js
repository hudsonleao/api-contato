module.exports = function (app) {
    const contactsModel = app.models.contactsModel;

    let controller = {};

    controller.getAllContacts = async (empresa, pagina, limite) => {
        try {
            let listaContacts = await contactsModel(empresa).findAll({
                offset: pagina == 0 ? 0 : (parseInt(pagina - 1)) * parseInt(limite),
                limit: parseInt(limite),
            });

            return { data: listaContacts, count: listaContacts.length };
        } catch (error) {
            console.error(error);
            return {
                error: {
                    message: 'Internal server error',
                    stage: 'getAllContacts'
                }
            };
        }
    };

    controller.getContactById = async (empresa, idContato) => {
        try {
            let listaContacts = await contactsModel(empresa).findOne({
                where: {
                    id: idContato
                }
            });

            return { data: listaContacts };
        } catch (error) {
            console.error(error);
            return {
                error: {
                    message: 'Internal server error',
                    stage: 'getContactById'
                }
            };
        }
    };

    controller.createContact = async (empresa, contatos) => {
        try {
            let listaContacts = [];

            for (const contato of contatos) {
                if (empresa === 'macapa') {
                    contato.nome = contato.nome.toUpperCase();
                    contato.celular = `+${contato.celular.substring(0, 2)} (${contato.celular.substring(2, 4)}) ${contato.celular.substring(4, 9)}-${contato.celular.substring(9, 13)}`;
                }
                listaContacts.push(await contactsModel(empresa).create({
                    ...contato
                }));
            }
            return { data: listaContacts };
        } catch (error) {
            console.error(error);
            return {
                error: {
                    message: 'Internal server error',
                    stage: 'createContact'
                }
            };
        }
    };

    controller.updateContact = async (empresa, idContato, novosDados) => {
        try {

            if (empresa === 'macapa') {
                if (novosDados.nome) {
                    novosDados.nome = novosDados.nome.toUpperCase();
                }
                if (novosDados.celular) {
                    novosDados.celular = `+${novosDados.celular.substring(0, 2)} (${novosDados.celular.substring(2, 4)}) ${novosDados.celular.substring(4, 9)}-${novosDados.celular.substring(9, 13)}`;
                }
            }

            await contactsModel(empresa).update(novosDados, {
                where: {
                    id: idContato
                }
            });
            return { data: novosDados };
        } catch (error) {
            console.error(error);
            return {
                error: {
                    message: 'Internal server error',
                    stage: 'updateContact'
                }
            };
        }
    };

    controller.deleteContact = async (empresa, idContato) => {
        try {
            await contactsModel(empresa).destroy({
                where: {
                    id: idContato
                }
            });
            return { message: 'Contact removed successfully.' };
        } catch (error) {
            console.error(error);
            return {
                error: {
                    message: 'Internal server error',
                    stage: 'deleteContact'
                }
            };
        }
    };

    return controller;
};