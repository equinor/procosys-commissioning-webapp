import { Card } from "@equinor/eds-core-react";
import styled from "styled-components";
import { SHADOW } from "../style/GlobalStyles";

export const CardWrapper = styled.article`
  & h3,
  label {
    margin: 0;
  }
  & h5 {
    margin: 12px 0;
  }
  margin-bottom: 16px;
  box-shadow: ${SHADOW};
  border-radius: 10px;
`;

type EdsCardProps = {
  title: string;
  icon?: JSX.Element;
  children: JSX.Element;
};

const EdsCard = ({ title, icon, children }: EdsCardProps): JSX.Element => {
  return (
    <CardWrapper>
      <Card style={{ padding: "0 12px 0 12px" }}>
        <Card.Header style={{ padding: "12px 0 0 0" }}>
          <Card.HeaderTitle>
            <h3>{title}</h3>
          </Card.HeaderTitle>
          {icon ? icon : null}
        </Card.Header>
        <div>{children}</div>
      </Card>
    </CardWrapper>
  );
};

export default EdsCard;
