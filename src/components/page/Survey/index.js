import React, { Component } from 'react';
import { Redirect } from 'react-router';

import Select from '../../shared/Form/Select';
import { CheckboxGroup } from '../../shared/Form/Checkbox';
import RadioGroup, { Radio } from '../../shared/Form/Radio';
import Button from '../../shared/Button';
import Tabs, { Tab } from '../../shared/Tabs';
import Nav from '../../shared/Nav';

// Custom API related
import getPlan from '../../../utils/mealPlan';
import { getSurveyData } from '../../../utils/data';
import submitSurvey from '../../../utils/submitSurvey';

import './Survey.css';

export default class Survey extends Component {
    componentWillMount() {
        this.data = getSurveyData();
        const count = this.data.selectOpt.mealCount[0].val || 1;
        const plan = this.data.selectOpt.planType[0].val || 1;
        const defaultDiet = {
            activeIndex: 0,
            name: this.data.dietSpec[0].name || 'Standard',
        };
        const calories = {
            activeIndex: 0,
            selected: 'rec',
            min: this.data.calories.min || 1200,
            max: this.data.calories.max || 2500,
        };

        this.setState({
            mealCount: count,
            planType: plan,
            healthPreferences: {},
            calories: calories,
            diet: defaultDiet,
            cookingTime: 30, // Default cooking time
            loading: false,
            redirect: false,
            customPlanDays: 1, // Default for custom days
        });
    }

    handleHealth = (name) => {
        this.setState((prevState) => ({
            healthPreferences: {
                ...prevState.healthPreferences,
                [name]: !prevState.healthPreferences[name],
            },
        }));
    };

    handleSelect = (e) => {
        const target = e.target;
        this.setState({ [target.name]: parseInt(target.value, 10) });
    };

    handleCalories = (index) => {
        const selected = parseInt(index, 10) === 1 ? 'custom' : 'rec';
        this.setState({
            calories: { ...this.state.calories, activeIndex: index, selected: selected },
        });
    };

    setCalories = (e) => {
        const target = e.target;
        const value = parseInt(target.value, 10);
        if (!isNaN(value)) {
            this.setState({
                calories: { ...this.state.calories, [target.name]: value },
            });
        }
    };

    handleDiet = (index) => {
        const name = this.data.dietSpec[index].name || 'Standard';
        this.setState({ diet: { activeIndex: index, name: name } });
    };

    // Added by Jordan
    handleCookingTime = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 15 && value <= 999) {
            this.setState({ cookingTime: value });
        }
    };

    goTo = (e) => {
        e.preventDefault();
        const Tabs = this.tabs;
        if (e.target.name === 'next') {
            Tabs.handleClick(Tabs.state.activeIndex + 1);
        } else if (e.target.name === 'back') {
            Tabs.handleClick(Tabs.state.activeIndex - 1);
        }
    };

    getMealPlan = (e) => {
        e.preventDefault();
        const { mealCount, planType, healthPreferences, calories, diet, cookingTime, customPlanDays } = this.state;
        const meals = this.data.mealTypes[mealCount];
        const requestData = {
            plan: planType,
            health: healthPreferences,
            calories: { min: calories.min, max: calories.max },
            diet: diet.name,
            cookingTime: cookingTime, // Include cooking time
            meals,
            days: planType === 6 ? customPlanDays : planType, // 6 is arbitrary, look at src/utils/data.js
        };

        console.log("Request Data Sent to getPlan:", requestData);

        this.setState({ loading: true }, () => {
            getPlan(requestData)
                .then((data) => {
                    console.log("Fetched Data:", data);
                    const newData = { num: planType, data: data };

                    this.setState({ loading: false, redirect: true, data: newData });

                    // Send survey data to MongoDB
                    try {
                        submitSurvey(requestData);
                    } catch (error) {
                        console.error("Error submitting survey data:", error);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching meal plan:", error);
                    this.setState({ loading: false });
                });
        });
    };

    render() {
        const { selectOpt, dietSpec, healthSpec } = this.data;
        const { planType, calories, cookingTime, customPlanDays } = this.state;

        return (
            <div className="Survey">
                <Nav />
                {this.state.loading ? (
                    <div className="Survey__loading">
                        <h1 className="Survey__loading__heading">Chopping those onions</h1>
                        <i className="fa fa-spinner Survey__loading__icon" aria-hidden="true"></i>
                    </div>
                ) : (
                    <div className="Survey__content">
                        <form>
                            <Tabs defaultIndex={0} ref={(component) => { this.tabs = component }} className="Survey__tabs">
                                <Tab heading="1">
                                    <h2>How many meals do you (or want to have) in a day?</h2>
                                    <Select
                                        name="mealCount"
                                        value={this.state.mealCount}
                                        handler={this.handleSelect}
                                        options={selectOpt.mealCount}
                                    />
                                    <div className="Survey__goto">
                                        <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                                    </div>
                                </Tab>

                                <Tab heading="2">
                                    <h2>Choose a plan type</h2>
                                    <Select
                                        name="planType"
                                        value={planType}
                                        handler={this.handleSelect}
                                        options={selectOpt.planType}
                                    />
                                    {planType === 6 && ( // Show dropdown for Custom Plan only
                                        <label>
                                        Number of Custom Days:

                                        {/* Custom plan menu by Willy*/}
                                        <Select
                                            name = "customPlanDays"
                                            value = {customPlanDays || 1} // Defaults to 1
                                            handler = {(e) => this.setState(
                                                { customPlanDays: parseInt(e.target.value, 10) }
                                            )}
                                            options = {[
                                                { val: 1, text: "1 Day" },
                                                { val: 2, text: "2 Days" },
                                                { val: 3, text: "3 Days" },
                                                { val: 4, text: "4 Days" },
                                                { val: 5, text: "5 Days" },
                                                { val: 6, text: "6 Days" },
                                            ]}
                                        />
                                        </label>
                                    )}
                                    <div className="Survey__goto">
                                        <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                                        <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                                    </div>
                                </Tab>

                                <Tab heading="3">
                                    <h2>Any dietary preferences?</h2>
                                    <RadioGroup handleChange={this.handleDiet} activeIndex={this.state.diet.activeIndex}>
                                        {dietSpec.map((diet) => <Radio key={diet.name}>{diet.text}</Radio>)}
                                    </RadioGroup>
                                    <div className="Survey__goto">
                                        <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                                        <Button name="skip" onClick={() => this.tabs.handleClick(3)}>Skip</Button>
                                        <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                                    </div>
                                </Tab>

                                <Tab heading="4">
                                    <h2>Any health preferences?</h2>
                                    <CheckboxGroup
                                        data={healthSpec}
                                        toggleHandler={this.handleHealth}
                                        isCheckedState={this.state.healthPreferences}
                                    />
                                    <div className="Survey__goto">
                                        <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                                        <Button name="skip" onClick={() => this.tabs.handleClick(4)}>Skip</Button>
                                        <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                                    </div>
                                </Tab>

                                <Tab heading="5">
                                    <h2>Calorie intake</h2>
                                    <RadioGroup handleChange={this.handleCalories} activeIndex={this.state.calories.activeIndex}>
                                        <Radio>Go with recommended</Radio>
                                        <Radio>Choose custom values</Radio>
                                    </RadioGroup>
                                    {this.state.calories.selected === "custom" ? (
                                        <div className="Survey__input--custom">
                                            <input
                                                placeholder="min"
                                                type="number"
                                                name="min"
                                                onChange={this.setCalories}
                                                value={this.state.calories.min}
                                            />
                                            <input
                                                placeholder="max"
                                                type="number"
                                                name="max"
                                                onChange={this.setCalories}
                                                value={this.state.calories.max}
                                            />
                                        </div>
                                    ) : null}
                                    <div className="Survey__goto">
                                        <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                                        <Button name="skip" onClick={() => this.tabs.handleClick(5)}>Skip</Button>
                                        <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                                    </div>
                                </Tab>

                                <Tab heading="6">
                                    <h2>Estimate Cooking Time (15-120 minutes)</h2>
                                    <input
                                        type="number"
                                        value={cookingTime}
                                        onChange={this.handleCookingTime}
                                        min="15"
                                        max="999"
                                    />
                                    <div className="Survey__goto">
                                        <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                                        <Button onClick={this.getMealPlan} className="Survey__goto__button--next">Get Plan!</Button>
                                    </div>
                                </Tab>
                            </Tabs>
                        </form>
                    </div>
                )}
                {this.state.redirect && (
                    <Redirect to={{ pathname: '/meal-plan', state: { data: this.state.data } }} />
                )}
            </div>
        );
    }
}
