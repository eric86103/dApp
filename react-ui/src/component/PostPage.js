import React, {Fragment} from 'react';
import { Link, Redirect } from 'react-router-dom';
import request from 'superagent';
import './Style.css';
import FileBase64 from 'react-file-base64'
import { Paper, Grid, Typography, InputAdornment, OutlinedInput, Select, Button, TextField } from '@material-ui/core'

const IPFS = require('ipfs-http-client')
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol:'https'})



const image2base64 = require('image-to-base64');
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login:this.props.login,
            productName: '',
            description: "",
            city: "",
            country: "",
            price      :  "",
            status: "",
            file: [],
            ipfsHash: '',
            buffer:'',
            base64:''
        }        
    }
    convertToBuffer = async(reader) => {
        //file is converted to a buffer to prepare for uploading to IPFS
          const buffer = await Buffer.from(reader);
        //set this buffer -using es6 syntax
          this.setState({buffer});
    };
  

    getFiles = (files) => {
        console.log(files)
        this.setState({ file: files })
        this.convertToBuffer(this.state.file[0].base64)
    }
    
    handleChange = prop  => event => {
        this.setState({ [prop]: event.target.value });
    };


    handleSubmit = () => {
        this.onSubmitandGet()
        // this.props.handlePost(this.state.productName, this.state.description, this.state.price, this.state.file[0].base64)
        //console.log(this.state.productName)
    }
    onSubmitandGet = async (event) => {
        console.log("Submit to IPFS")
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err,ipfsHash);
          //setState by setting ipfsHash to ipfsHash[0].hash 
          this.setState({ ipfsHash:ipfsHash[0].hash });
          ipfs.get(this.state.ipfsHash, (err, files) => {
            files.forEach((file) => {
                this.setState({
                    base64:file.content.toString('utf8')
                })
            })
          })
        }) //await ipfs.add 
    }; //onSubmit 

    render() {
        if(this.props.login === false){
            return <Redirect push to = '/login'/>;
        } else {
            return  <Fragment>
                        <Grid container alighItems='center'>
                            
                            <Paper style={{marginLeft: "auto", marginRight:"auto", padding: 30,height: "100vh", width: "70%"}} elevation="1">
                            <Paper style={{marginLeft: "auto", marginRight:"auto", padding: 20, width: "70%"}} elevation="0">
                                <Typography variant='h2' style={{textAlign: 'center', fontFamily:"Arial Rounded MT Bold"}} justify="center" alignItems="center">
                                    Basic Information
                                </Typography>
                            </Paper>
                                <Grid container direction='row' alighItems='center' style={{marginTop:30}} spacing={24}>
                                    <Grid item sm>
                                        <Grid container direction='column' spacing={24} justify='space-around'>
                                            <Grid item>
                                                <TextField
                                                    id="outlined-adornment-productName"
                                                    variant="outlined"
                                                    label="Product Name"
                                                    value={this.state.productName}
                                                    onChange={this.handleChange('productName')}
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                                                    }}
                                                    />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="outlined-adornment-description"
                                                    variant="outlined"
                                                    label="Description"
                                                    value={this.state.description}
                                                    onChange={this.handleChange('description')}
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                                                    }}
                                                    />
                                            </Grid>
                                            <Grid item>
                                            <Select
                                                native
                                                value={this.state.status}
                                                onChange={this.handleChange('status')}
                                                input={
                                                    <OutlinedInput
                                                    name="Status"
                                                    fullWidth
                                                    id="outlined-status-native-simple"
                                                    />
                                                }
                                                >
                                                <option value="" />
                                                <option value={1}>Secondhand</option>
                                                <option value={0}>Brandnew</option>
                                                </Select>
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="outlined-adornment-city"
                                                    variant="outlined"
                                                    label="Your Ditrict, City"
                                                    value={this.state.city}
                                                    onChange={this.handleChange('city')}
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                                                    }}
                                                    />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                id="outlined-adornment-country"
                                                variant="outlined"
                                                label="Your Country"
                                                value={this.state.country}
                                                onChange={this.handleChange('country')}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"></InputAdornment>,
                                                }}
                                                />
                                            </Grid>
                                            
                                            
                                            
                                            <Grid item>
                                                
                                                <Grid container justify="space-between"alignItems="flex-end">
                                                    <TextField
                                                        id="outlined-adornment-price"
                                                        variant="outlined"
                                                        label="Price"
                                                        value={this.state.price}
                                                        onChange={this.handleChange("price")}
                                                        // helperText="Product Name"
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        }}
                                                        />
                                                    <Grid item>
                                                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}/*style={{marginLeft:'65%', marginRight:'5%'}}*/ >
                                                            POST
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                        
                                        </Grid>
                                    </Grid>
                                    
                                    <Grid sm item>
                                        <Paper style={{marginLeft: "auto", marginRight:"auto",padding:20, height: "50vh", width:"20vw"}} elevation="0">
                                            <div className="FileUpload dropzone">
                                                <FileBase64
                                                multiple={ true }
                                                onDone={ this.getFiles } />
                                                <br/>   
                                            </div>
                                                <div>
                                                    <br/>   
                                                    <div className="text-center">
                                                    {this.state.file[0] ? 
                                                        <img src={this.state.file[0].base64} style={{maxWidth: "20vw"}}/>: null}
                                                </div>
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>                                
                            </Paper>
                        </Grid>
                    </Fragment>
                // <div className='row'>
                //     <div className='col-4'></div>
                //     <div className='col-4'>
                //         <br/>
                //         <form>
                //             <div class="form-group">
                //                 <label >Product Name</label>
                //                 <input type="text" class="form-control" id="productName" name="productName" value={this.state.productName} onChange={this.handleForm}/>
                //             </div>
                //             <div class="form-group">
                //                 <label >Description</label>
                //                 <input type="text" class="form-control" id="description" name="description" value={this.state.description} onChange={this.handleForm}/>
                //             </div>
                //             <div class="form-group">
                //                 <label >Price</label>
                //                 <input type="text" class="form-control" id="price" name="price" value={this.state.price} onChange={this.handleForm}/>
                //             </div>
                //             <br/>   
                //             <div className="FileUpload dropzone">
                //                 <Dropzone
                //                     onDrop={this.onImageDrop.bind(this)}
                //                     multiple={false}
                //                     accept="image/*">
                //                     <div>Drop an image or click to select a file to upload.</div>
                //                 </Dropzone>
                //                 <br/>   
                //             </div>
                //             <Link to='/' ><button type="submit" class="btn btn-outline-secondary btn-block" onClick={this.handleSubmit}>SELL</button></Link>
        
                //             <div>
                //                 <br/>   
                //                 {this.state.uploadedFileCloudinaryUrl === '' ? null :
                //                 <div>
                //                     <p>{this.state.fileName}</p>
                //                     <img src={this.state.uploadedFileCloudinaryUrl} />
                //                 </div>
                //                 }
                //             </div>
                //         </form>
                //         <br/>   
                //         <br/>   
                //     </div>
                //     <div className='col-4'></div>
                // </div>
            
        }
        
    }
}