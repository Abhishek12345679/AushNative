import {gql} from '@apollo/client';

export const GET_DRUG = gql`
  query getDrug($id: String!) {
    getDrug(id: $id) {
      id
      image_url
      name
      salt
      habit_forming
      price
      requires_prescription
      manufacturer_name
      description {
        introduction
        side_effects
        uses
        how_to_cope_with_side_effects {
          question
          answer
        }
        how_to_use
        safety_advice {
          question
          answer
        }
        how_does_it_work
      }
    }
  }
`;
