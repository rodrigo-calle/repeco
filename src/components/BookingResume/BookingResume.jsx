/* eslint-disable no-underscore-dangle */
import { Button } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import './BookingResume.css';
import { differenceInDays, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { es } from 'date-fns/locale';

const BookingResume = ({ cartRooms }) => {
  const navigate = useNavigate();
  const calcSubTotal = () => {
    const result = cartRooms
      .map(
        (cart) =>
          cart.room.price *
          differenceInDays(new Date(cart.checkOut), new Date(cart.checkIn)),
      )
      .reduce((prev, next) => prev + next);
    return result;
  };

  const calcIgv = () => {
    const subTotal = calcSubTotal();
    const igv = 0.18 * subTotal;
    return igv.toFixed(2).toString();
  };

  const calcTotal = () => {
    const result = Number(calcSubTotal()) + Number(calcIgv());
    return result.toFixed(2).toString();
  };

  const handleClick = () => {
    navigate('/payment');
  };

  return (
    <div>
      {cartRooms.length ? (
        <div>
          <div className="booking-container__resume">
            <h3 className="resume__title">RESUMEN DE LA RESERVA</h3>
            <hr />
            {cartRooms.map((item) => (
              <div key={item?.room?._id}>
                <p className="resume__room-title"> {item?.room?.title}</p>
                <div className="resume__dates-container">
                  <div>
                    <p className="resume__date-header">Entrada</p>
                    <p className="resume__date">
                      {format(
                        new Date(Date.parse(item?.checkIn)),
                        'EEE, dd-MM-yyyy',
                        { locale: es },
                      )}
                    </p>
                    <p className="resume__time">De 15:00</p>
                  </div>
                  <div>
                    <p className="resume__date-header">Salida</p>
                    <p className="resume__date">
                      {format(
                        new Date(Date.parse(item?.checkOut)),
                        'EEE, dd-MM-yyyy',
                        { locale: es },
                      )}
                    </p>
                    <p className="resume__time">A 12:00</p>
                  </div>
                </div>

                <div className="resume__days">
                  <p className="resume__days-header">
                    Duración total de la estancia
                  </p>
                  <p className="resume__total-days">2 noches</p>
                  <hr />
                </div>
              </div>
            ))}

            <div className="resume__selection">
              <p className="resumen__selection-header">Tu selección Total:</p>
              <p className="resume__total-rooms">
                {cartRooms.length} Habitaciones
              </p>
            </div>
          </div>
          <div className="booking-container__price price-container__background">
            <div className="price__subtotal">
              <p>Sub Total</p>
              <p>$ {calcSubTotal()}</p>
            </div>
            <div className="price__igv">
              <p>IGV(18%)</p>
              <p>$ {calcIgv()}</p>
            </div>
            <div className="price__total">
              <p>TOTAL</p>
              <p>$ {calcTotal()}</p>
            </div>
          </div>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClick}
            style={{ backgroundColor: '#004778' }}
          >
            Reservar
          </Button>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

BookingResume.propTypes = {
  cartRooms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          imageName: PropTypes.string,
          imageUrl: PropTypes.string,
        }),
      ),
      services: PropTypes.arrayOf(
        PropTypes.shape({
          serviceName: PropTypes.string,
          serviceUrl: PropTypes.string,
        }),
      ),
      price: PropTypes.number,
      capacity: PropTypes.number,
      hotel: PropTypes.shape({
        address: PropTypes.shape({
          street: PropTypes.string,
          city: PropTypes.string,
          province: PropTypes.string,
          country: PropTypes.string,
        }),
        name: PropTypes.string,
        category: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        user: PropTypes.string,
      }),
    }),
  ).isRequired,
};

export default BookingResume;
