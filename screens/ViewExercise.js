import React from 'react';
import {
    Container,
    Header,
    Content,
    Form,
    Item,
    Input
} from 'native-base';

export default function ViewExercise() {
    return (
        <Container>
            <Header />
            <Content>
                <Form>
                    <Item>
                        <Input placeholder="Search Exercise" />
                    </Item>
                </Form>
            </Content>
        </Container>
    );
}