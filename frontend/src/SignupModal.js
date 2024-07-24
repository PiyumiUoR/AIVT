import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

const SignupModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Sign Up Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </Modal>
  );
};

export default SignupModal;
