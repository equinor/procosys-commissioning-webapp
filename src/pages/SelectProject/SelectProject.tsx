import { Navbar, ProcosysButton } from "@equinor/procosys-webapp-components";
import { useContext } from "react";
import AsyncPage from "../../components/AsyncPage";
import PageHeader from "../../components/PageHeader";
import EdsIcon from "../../components/icons/EdsIcon";
import SideMenu from "../../components/navigation/SideMenu";
import PlantContext from "../../contexts/PlantContext";
import { SelectPlantWrapper, SelectorButton } from "../SelectPlant/SelectPlant";

const SelectProject = (): JSX.Element => {
  const {
    availableProjects: projects,
    currentPlant,
    fetchProjectsAndPermissionsStatus
  } = useContext(PlantContext);

  return (
    <>
      <Navbar
        testColor
        rightContent={<SideMenu />}
        leftContent={<ProcosysButton />}
      />
      <SelectPlantWrapper>
        <AsyncPage
          fetchStatus={fetchProjectsAndPermissionsStatus}
          errorMessage={"Unable to load projects. Please try again."}
          emptyContentMessage={
            "There are no projects available. Try selecting a different plant."
          }
        >
          <>
            <PageHeader
              title={"Select project"}
              subtitle={currentPlant?.title}
            />
            {projects?.map((project) => (
              <SelectorButton
                key={project.id}
                to={`/${currentPlant?.slug}/${project.title}`}
              >
                <div>
                  <label>{project.title}</label>
                  <p>{project.description}</p>
                </div>
                <EdsIcon name="chevron_right" title="chevron right" />
              </SelectorButton>
            ))}
          </>
        </AsyncPage>
      </SelectPlantWrapper>
    </>
  );
};

export default SelectProject;
