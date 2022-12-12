const express = require("express");
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


const url = 'https://thecoffeevn.com/menu-order/';


// SET UP
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());
dotenv.config();

app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
}));

// ROUTES
//function get 
const filter = (name,id)  => {
    app.get(`/v1${name}`,(req,resp) => {
        const thumbnails = [];
        const limit = Number(req.query.limit);
        try {
           axios(url).then((res) => {
            const html = res.data;
          
            const $$ = cheerio.load(html);
            const div = $$(`#${id}`).html();
            
            
            $$('.parents_item',div).each(function() {
                const price =$$(this).find('.devvn_prd_list_option').attr('data-price-text') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_cont').find('.devvn_menuorder_title_price').find('.devvn_menuorder_price').find('span').text();
                const image = $$(this).find('.devvn_prd_list_option').attr('data-prdthumb') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_thumb').find('img').attr('src');;
                const name = $$(this).find('.devvn_prd_list_option').attr('data-prdtitle') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_cont').find('.devvn_menuorder_title_price').find('h3').text();
                if(price && image && name)   
                    thumbnails.push({
                        name : name,
                        image : image,
                        price : price,
                    })
            })
            if(limit && limit > 0) {//  
                resp.status(200).json(thumbnails.slice(0,limit));
            }
            resp.status(200).json(thumbnails); 
            
           })
        } catch (error) {
            resp.status(500).json(err);
        }
    });
}
app.get('/v1',(req,resp) => {
    const thumbnails = [];
    try {
       axios(url).then((res) => {
        const html = res.data;
      
        const $$ = cheerio.load(html);
       
        
        $$('.parents_item',html).each(function() {
            const price =$$(this).find('.devvn_prd_list_option').attr('data-price-text') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_cont').find('.devvn_menuorder_title_price').find('.devvn_menuorder_price').find('span').text();
            const image = $$(this).find('.devvn_prd_list_option').attr('data-prdthumb') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_thumb').find('img').attr('src');;
            const name = $$(this).find('.devvn_prd_list_option').attr('data-prdtitle') ?? $$(this).find('.devvn_add_to_cart').find('.devvn_entry_cont').find('.devvn_menuorder_title_price').find('h3').text();
                if(price && image && name)   
                    thumbnails.push({
                        name : name,
                        image : image,
                        price : price,
                    })
        })
        if(limit && limit > 0) {//  
            resp.status(200).json(thumbnails.slice(0,limit));
        }else{
            resp.status(200).json(thumbnails);
        }
         
       })
    } catch (error) {
        resp.status(500).json(err);
    }
});


filter('/espresso','term_82');
filter('/speacial-tea','term_97');
filter('/juice&smoothies','term_86');
filter('/cookie','term_94');
filter('/hot-tea','term_85');
filter('/food','term_92');
filter('/ice-cream','term_93');

app.get('/v1/:character',(req,resq) => {
    try {
        axios(`url`)
    } catch (error) {
        resp.status(500).json(err);
    }
})



//Run port

app.listen(process.env.PORT || 8000, () => {
    console.log('server is running');
})