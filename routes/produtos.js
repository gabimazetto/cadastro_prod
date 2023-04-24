const { Router } = require("express");
const {Produto, produtoJoi} = require("../model/produto");
const Joi = require('joi');
const router = Router();


// Insere produtos (POST)
router.post("/produtos", async (req, res) => {
    try {
        // Validar os dados do req.body usando o Joi
        const { error } = produtoJoi.validate(req.body);

        if (error) {
            // Se houver um erro na validação, responder com um código 400 e uma mensagem de erro
            return res.status(400).json({
                mensagem: 'Erro na validação dos dados',
                erro: error.details[0].message
            });
        }

        // Caso contrário, criar o produto no banco de dados ou fazer outras operações necessárias
        const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem } = req.body;
        const produto = new Produto({ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem });
        await produto.save();

        res.status(201).json({ mensagem: 'Produto criado com sucesso', produto });
    } catch (error) {
        console.log("Ocorreu um erro ", error);
        res.status(500).json({ mensagem: "Ocorreu um erro", error });
    }
});


// Consulta todos produtos (GET)
router.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        console.log({ message: "Ocorreu um erro" });
        res.status(500).json({ message: "Ocorreu um erro" });
    }
});


// Consultar com filtro: http://localhost:3000/produtos?nome=me
router.get("/produtos", async (req, res) => {
    try {
    const { nome, categoria, precoMin, precoMax } = req.query;
    const filtro = {};

    if (nome) {
        filtro.nome = { $regex: nome, $options: "i" };
    }
    if (categoria) {
        filtro.categoria = categoria;
    }
    if (precoMin && precoMax) {
        filtro.preco = { $gte: precoMin, $lte: precoMax };
    } else if (precoMin) {
        filtro.preco = { $gte: precoMin };
    } else if (precoMax) {
        filtro.preco = { $lte: precoMax };
    }

    const produtos = await Produto.find(filtro);

    if (produtos.length > 0) {
        res.json(produtos);
    } else {
        res.status(404).json({ mensagem: "Nenhum produto encontrado!" });
    }
    } catch (error) {
    console.log("Ocorreu um erro ", error);
    res.status(500).json({ mensagem: "Ocorreu um erro", error });
    }
});


// Consulta por id (GET)
router.get("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //realiza uma busca específica via findById filtrando o id
        const produto = await Produto.findById(id);
        if (produto) {
            res.json({ message: "Produto encontrado: ", produto });
        } else {
            res.status(404).json({ message: "Produto não encontrado!" })
        }
    } catch (error) {
        console.log("Ocorreu um erro ", error);
    }
});


// Editar produtos (PUT)
router.put("/produtos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem } = req.body;
        const produto = await Produto.findByIdAndUpdate(id,{ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem });

        // Validar os dados do req.body usando o Joi
        const { error } = produtoJoi.validate(req.body);

        if (error) {
            // Se houver um erro na validação, responder com um código 400 e uma mensagem de erro
            return res.status(400).json({
                mensagem: 'Erro na validação dos dados',
                erro: error.details[0].message
            });
        }else if(produto){
            res.json({message: "Produto editado!"})
        }
    } catch (error) {
        console.log("Ocorreu um erro ", error);
        res.status(500).json({ mensagem: "Ocorreu um erro", error });
    }
});

// Excluir produto (DELETE)
router.delete("/produtos/:id", async (req, res) => {
    try {
        // Checa se a tarefa existe, e então remove do banco
        const { id } = req.params;
        const produto = await Produto.findByIdAndRemove(id);

        if (produto) {
            res.json({ message: "Produto excluída." });
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


module.exports = router;