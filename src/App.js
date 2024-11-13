import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';

import './global.css';

import Landing from './components/page/Landing';
import Survey from './components/page/Survey';
import Plan from './components/page/Plan';
import Footer from './components/shared/Footer';
import HistoryTab from './components/HistoryTab';
import MealPlanDisplay from './components/MealPlanDisplay';

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Landing} />
        <Route path="/survey" component={Survey} />
        <Route path="/meal-plan" component={Plan} />
        <Route path="/history" component={HistoryTab} />
        <Route path="/meal-plan/:id" component={MealPlanDisplay} />
        <Footer />
      </div>
    );
  }
}

export default App;