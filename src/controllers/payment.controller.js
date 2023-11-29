import axios from 'axios';
import {PAYPAL_API, 
        HOST,
        PAYPAL_API_CLIENT, 
        PAYPAL_API_SECRET,} from "../config.js";


/**************************************************** 
     * CREACION DE LA ORDEN
 *****************************************************/

export const createOrder =  async (req, res) => {
    
    const order = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "100.00",
                },
            },
        ],
        aplication_context: {
            brand_name: "Mi tienda",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `${HOST}/capture-order`,
            cancel_url: `${HOST}/cancel-payment`,
        },
    };

    /**************************************************** 
     * AUTENTICACION
     *****************************************************/
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const { 
        data: {access_token},
       } =  await axios.post(
        `${PAYPAL_API}/v1/oauth2/token`,
         params,
          {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    })

     /**************************************************** 
     * envio post a la url y mando la orden con el token generado de la autenticacion
     *****************************************************/
    
    const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders`,
         order, 
         {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
      }
    ); 
    
    return res.json(response.data)

}

/**************************************************** 
     * CAPTURA DE LA ORDEN
 *****************************************************/
export const captureOrder = async (req, res) => {
    const { token } = req.query
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {}, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    })
    console.log(response.data)
    return res.send('payed')
}

export const cancelPayment = (req, res) => res.redirect('/')
