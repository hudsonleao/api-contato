const validacao = require('../../config/validationRoutes');

module.exports = (app) => {
    const contactsController = app.controllers.contactsController;

    /**
    * Função para buscar todos os contatos
    * @route GET /contacts
    * @group contacts - CRUD de contatos
    * @headers {string} 200.authorization - token gerado na url de autenticação
    * @returns {object} 200 - {"data": [{"id": integer, "nome": "string", "celular": "string"}], "count": integer }
    * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}, {"message": "query.field" is required"]}
    * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
    * @returns {Error}  500 - {"message": "Internal server error", "stage": "string"}
    */
    app.get('/contacts', async (req, res) => {
        try {

            const { headers, query } = req;
            let erro = await validacao({ headers, query });
            if (erro) return res.status(400).json({ messages: erro });

            const { empresa } = headers;
            let { pagina, limite } = query;
            if (!pagina) pagina = 1;
            if (!limite) limite = 100;

            const contatos = await contactsController.getAllContacts(empresa, pagina, limite);
            if (contatos.error) {
                res.status(500).json(contatos.error);
            }
            res.status(200).json(contatos);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    /**
   * Função para buscar um contato por Id
   * @route GET /contacts/:idContato
   * @group contacts - CRUD de contatos
   * @headers {string} 200.authorization - token gerado na url de autenticação
   * @returns {object} 200 - {"data": {"id": integer, "nome": "string", "celular": "string"} }
   * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}, {"message": "params.field" is required"}]}
   * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
   * @returns {Error}  500 - {"message": "Internal server error", "stage": "string"}
   */
    app.get('/contacts/:idContato', async (req, res) => {
        try {
            const { headers, params } = req;
            let erro = await validacao({ headers, params });
            if (erro) return res.status(400).json({ messages: erro });

            const { empresa } = headers;
            const { idContato } = params;

            const contato = await contactsController.getContactById(empresa, idContato);
            if (contato.error) {
                res.status(500).json(contato.error);
            }
            res.status(200).json(contato);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    /**
   * Função para criar um ou mais contatos. Obs: é esperado um array de objetos
   * @route POST /contacts
   * @group contacts - CRUD de contatos
   * @headers {string} 200.authorization - token gerado na url de autenticação
   * @returns {object} 200 - {"data": [{"id": integer, "nome": "string", "celular": "string"}], "count": integer }
   * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}, {"message": "body.field" is required"}, {"message": ""value" must be an array"}]}
   * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
   * @returns {Error}  500 - {"message": "Internal server error", "stage": "string"}
   */
    app.post('/contacts', async (req, res) => {
        try {

            const { headers, body } = req;
            let erro = await validacao({ headers, bodyCreate: body });
            if (erro) return res.status(400).json({ messages: erro });

            const { empresa } = headers;
            const contatos = body;

            const contato = await contactsController.createContact(empresa, contatos);
            if (contato.error) {
                res.status(500).json(contato.error);
            }
            res.status(200).json(contato);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    /**
 * Função para editar um contato
 * @route PUT /contacts/:idContato
 * @group contacts - CRUD de contatos
 * @headers {string} 200.authorization - token gerado na url de autenticação
 * @returns {object} 200 - {"data": {"id": integer, "nome": "string", "celular": "string"} }
 * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}, {"message": "body.field" is required"}, {"message": "params.field" is required"]}
 * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
 * @returns {Error}  500 - {"message": "Internal server error", "stage": "string"}
 */
    app.put('/contacts/:idContato', async (req, res) => {
        try {

            const { headers, params, body } = req;
            let erro = await validacao({ headers, params, bodyUpdate: body });
            if (erro) return res.status(400).json({ messages: erro });

            const { empresa } = headers;
            const { idContato } = params;
            const novosDados = body;

            const contato = await contactsController.updateContact(empresa, idContato, novosDados);
            if (contato.error) {
                res.status(500).json(contato.error);
            }
            res.status(200).json(contato);
        } catch (error) {
            res.status(500).json(error);
        }
    });

    /**
 * Função para remover um contato
 * @route DELETE /contacts/:idContato
 * @group contacts - CRUD de contatos
 * @headers {string} 200.authorization - token gerado na url de autenticação
 * @returns {object} 200 - {"message": 'Contact removed successfully."}
 * @returns {Error}  400 - {"messages": [{"message": "headers.authorization" is required"}, {"message": "params.field" is required"}]}
 * @returns {Error}  401 - {"messages": [{"message": "Invalid token"}]}
 * @returns {Error}  500 - {"message": "Internal server error", "stage": "string"}
 */
    app.delete('/contacts/:idContato', async (req, res) => {
        try {

            const { headers, params } = req;
            let erro = await validacao({ headers, params });
            if (erro) return res.status(400).json({ messages: erro });

            const { empresa } = headers;
            const { idContato } = params;

            const contato = await contactsController.deleteContact(empresa, idContato);
            if (contato.error) {
                res.status(500).json(contato.error);
            }
            res.status(200).json(contato);
        } catch (error) {
            res.status(500).json(error);
        }
    });

};