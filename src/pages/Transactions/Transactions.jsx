import TopBar from "../commons/TopBar/TopBar";
import Menu from "../commons/Menu/Menu";
import Grid from '@mui/material/Grid';
import { Card } from '@mui/material'
import {useState, useEffect} from 'react'
import './styles.css'
import { getWalletsApi } from '../../api/api'
import { Typography } from "@mui/material";
import ContentPage from '../commons/ContentPage/ContentPage'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Transactions = () => {
    const [wallets, setWallets] = useState()
    const [apiErrors, setApiErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    let env = useSelector((state) => state.dashboard.envSelectedId)


    const handleWallet = (wallet) => {
        navigate(`/transactions/${wallet}`)
    }

    useEffect(() =>  {
        const accessToken = JSON.parse(sessionStorage.getItem('auth')).accessToken;
        
        const getTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await getWalletsApi(env, accessToken);

                if (response.status === 200) {
                    const result = await response.json();
                    setWallets(result);
                    
                } else {
                    setApiErrors({ _general: 'Algo estranho aconteceu. Tente novamente mais tarde' });
                }
            } catch (error) {
                setApiErrors({ _general: 'Algo estranho aconteceu. Tente novamente mais tarde' });
            } finally {
                setIsLoading(false); 
            }
        };


        getTransactions();


    }, []);
    return (
        <>
            <TopBar />
            <Grid container>
                <Menu />
                
                <ContentPage className="content-page">
                  <Typography variant="h2">Transações</Typography>
                  {wallets && wallets.map((wallet, index) => <>
                        <Card key={index} variant="outlined" className='card' onClick={() => handleWallet(wallet.id)}>
                            <Grid item sm={2} className='icon'>
                                {`Wallet: ${wallet.currency}`}
                            </Grid>
                        </Card>
                  </>)}
              

                </ContentPage>
            </Grid>
        </>
    )
}

export default Transactions;