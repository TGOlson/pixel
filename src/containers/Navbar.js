import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const Navbar = () => (
  <div>
    <h1 style={{ display: 'inline-block' }}>Pixel</h1>
    <Link href="/#" to="/"><button>Home</button></Link>
    <Link href="/#" to="/about"><button>About</button></Link>
  </div>
);

export default connect(state => state)(Navbar);
