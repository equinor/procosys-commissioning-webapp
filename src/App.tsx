import React from 'react';
import Navbar from './components/navigation/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SelectPlant from './components/pages/SelectPlant';
import SelectProject from './components/pages/SelectProject';
import { PlantContextProvider } from './contexts/PlantContext';
import { UserContextProvider } from './contexts/UserContext';
import SearchPage from './components/pages/SearchPage';

function App() {
    return (
        <>
            <UserContextProvider>
                <Router>
                    <PlantContextProvider>
                        <Navbar />
                        <Switch>
                            <Route
                                exact
                                path={['/select-plant', '/']}
                                component={SelectPlant}
                            />
                            <Route
                                exact
                                path="/:plant"
                                component={SelectProject}
                            />
                            <Route
                                exact
                                path="/:plant/:project"
                                component={SearchPage}
                            />

                            {/* 
                      STARTSIDE (/)
                      SELECT PLANT (/select-plant)
                      SELECT PROJECT (/:plant/select-project)
                      SØK (:plant/search-packages)
                        PACKAGE (:plant/:prosjekt/:comm-package/scopes) (Default til liste over scopes)
                          SCOPE-LISTE ^
                            SCOPE (:plant/:package/:scope)
                              NEW PUNCH
                          TASK-LISTE (:plant/:package/tasks)
                            TASK (:plant/:package/:task)
                          PUNCH-LISTE (:plant/:package/punches)
                            PUNCH (:plant/:package/:punch)
                      */}
                        </Switch>
                    </PlantContextProvider>
                </Router>
            </UserContextProvider>
        </>
    );
}

export default App;

/* 
STARTSIDE > NAV-MENY > velg plant > API: Hent liste over plants 
                  velg prosjekt > API: Hent liste over pros jekter
          > SØK ETTER PACKAGE > API: Finn package basert på valgt prosjekt og plant
          > bokmerke > gå til package 

          PACKAGE > nav > Gå tilbake til startside
                  > Infocard om package
                  
                  > SCOPE >  nav > tilbake til package
                                      NEW PUNCH > nav tilbake til scope
                                                > module tag visning
                                                > Skjema for å opprette ny punch
                                      Scope status-card
                  > TASK-LISTE > nav > tilbake til package
                               > TASK > Task status
                                        > Task description
                                        > Task comment
                  > PUNCH LIST
                        > nav > tilbake til package
                        > PUNCH

*/
