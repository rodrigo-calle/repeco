/* eslint-disable */
import { useState, forwardRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import room from '../../services/room';
import NumberFormat from 'react-number-format';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import './UpdateRoom.css';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import aditionalServices from '../CreateRoom/functions';
import { useParams } from 'react-router-dom';
import Loading from '../loading/loading';

const Input = styled('input')({
  display: 'none',
});

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

const UpdateRoom = () => {
  const [values, setValues] = useState({
    title: '',
    description: '',
    capacity: 0,
    price: '0',
  });

  const [files, setFiles] = useState(null);

  // no creo que sea la mejor solucion al problema de la inmutabilidad pero funciona
  const initialService = JSON.parse(JSON.stringify(aditionalServices));

  const [services, setServices] = useState(initialService);

  const { id } = useParams();

  useEffect(() => {
    const getDataUserById = async () => {
      const response = await room.getRoomById(id);
      const payload = await response.json();
      if (response.ok) {
        setValues({
          title: payload.title,
          description: payload.description,
          capacity: payload.capacity,
          price: payload.price,
        });
        payload.services.forEach((acData) => {
          const change = services.find(
            (service) => service.serviceName === acData.serviceName,
          );
          const index = services.indexOf(change);
          change.isSelected = true;
          const newArr = services.map((elem, i) =>
            index === i ? change : elem,
          );
          setServices(newArr);
        });
      }
    };

    getDataUserById();
    // return () => {
    //   console.log(aditionalServices);
    //   alert('hola mundo');
    // };
  }, []);

  // console.log(actualData.services);

  const handleChangeFiles = (e) => {
    setFiles(e.target.files);
  };

  const handleCheckboxChange = (index) => {
    const change = services.find((service, i) => i === index);
    change.isSelected = !change.isSelected;
    const newArr = services.map((elem, i) => (index === i ? change : elem));
    setServices(newArr);
  };

  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selecteds = services.filter((service) => service.isSelected === true);
    const serviceClean = selecteds.map((selected) => {
      delete selected.isSelected;
      return selected;
    });
    const serviceString = JSON.stringify(serviceClean);
    const formData = new FormData();
    formData.append('file', values.title);
    formData.append('file', values.description);
    formData.append('file', values.capacity);
    formData.append('file', values.price);
    formData.append('file', serviceString);
    for (const myfile of files) {
      formData.append('file', myfile);
    }
    setLoading(true);
    const result = await room.updateRoom(formData, id);
    console.log(result);
    confirm(result);
  };

  const confirm = (result) => {
    if (result.statusText === 'Created') {
      setCreated(true);
      setLoading(false);
    } else {
      setCreated(false);
    }
  };

  return (
    <div className="UpdateRoom">
      <div className="UpdateRoom__header">
        <h1>Editar room</h1>
      </div>
      <form onSubmit={handleSubmit} className="UpdateRoom__form" action="">
        <div className="UpdateRoom__typeparameter">
          <TextField
            sx={{ m: 2 }}
            onChange={handleChange}
            id="outlined-basic"
            label="Título"
            variant="outlined"
            name="title"
            value={values.title}
            required
          />

          <TextField
            sx={{ m: 2 }}
            id="outlined-multiline-static"
            label="Descripción"
            multiline
            rows={1}
            onChange={handleChange}
            name="description"
            value={values.description}
            required
          />

          <TextField
            sx={{ m: 2 }}
            id="outlined-number"
            label="Cantidad de Huespedes"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={values.capacity}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextField
            sx={{ m: 2 }}
            label="Precio"
            value={values.price}
            onChange={handleChange}
            name="price"
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
            required
          />
        </div>

        <div>
          {services.map((service, index) => {
            return (
              <FormControlLabel
                key={service.serviceName}
                control={
                  <Checkbox
                    checked={service.isSelected}
                    onChange={() => handleCheckboxChange(index)}
                    name={service.serviceName}
                  />
                }
                label={service.serviceName}
              />
            );
          })}
        </div>

        <label htmlFor="uploadfotos">
          <Input
            sx={{ m: 2 }}
            accept="image/*"
            id="uploadfotos"
            multiple
            name="file"
            onChange={handleChangeFiles}
            value={values.images}
            type="file"
            required
          />
          <Button
            sx={{ m: 2 }}
            variant="contained"
            component="span"
            endIcon={<PhotoCameraIcon />}
          >
            Fotos del Cuarto
          </Button>
        </label>
        <div>
          <label htmlFor="submitbutton">
            <Button variant="contained" type="submit" endIcon={<SendIcon />}>
              Enviar
            </Button>
          </label>
        </div>
      </form>
      {created ? (
        <h3 className="UpdateRoom__confirm"> Habitación Actualizada</h3>
      ) : null}
      {loading ? <Loading /> : null}
    </div>
  );
};
export default UpdateRoom;
