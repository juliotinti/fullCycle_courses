package createclient

import (
	"testing"

	"github.com/juliotinti/fullCycle_courses/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type ClientGatewayMock struct {
	mock.Mock
}

func (c *ClientGatewayMock) Save(client *entity.Client) error {
	args := c.Called(client)
	return args.Error(0)
}

func (c *ClientGatewayMock) Get(id string) (*entity.Client, error) {
	args := c.Called(id)
	return args.Get(0).(*entity.Client), args.Error(1)
}

func TestCreateClientUseCase_Execute(t *testing.T) {
	clientGatewayMock := &ClientGatewayMock{}
	clientGatewayMock.On("Save", mock.Anything).Return(nil)
	useCase := NewCreateClientUseCase(clientGatewayMock)

	output, err := useCase.Execute(CreateClientInputDTO{
		Name:  "Julio",
		Email: "j@j"})
	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.Equal(t, "Julio", output.Name)
	assert.Equal(t, "j@j", output.Email)
	clientGatewayMock.AssertExpectations(t)
	clientGatewayMock.AssertNumberOfCalls(t, "Save", 1)
}
