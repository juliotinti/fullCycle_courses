package app_test

import (
	"testing"

	"github.com/juliotinti/go-hexagonal/app"
	uuid "github.com/satori/go.uuid"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable_whenPriceGreaterThanZero_shouldSuccess(t *testing.T) {
	product := app.Product{}
	product.Name = "Product 1"
	product.Status = app.DISABLED
	product.Price = 10

	err := product.Enable()
	require.Nil(t, err)
}

func TestProduct_Enable_whenPriceLessThanZero_shouldThrowError(t *testing.T) {
	product := app.Product{}
	product.Name = "Product 1"
	product.Status = app.DISABLED

	product.Price = 0
	err := product.Enable()
	require.Equal(t, "the price must be greater than zero to enable the product", err.Error())
}

func TestProduct_Disable_whenPriceEqualsZero_shouldSuccess(t *testing.T) {
	product := app.Product{}
	product.Name = "Product 1"
	product.Status = app.ENABLED
	product.Price = 0

	err := product.Disable()
	require.Nil(t, err)
}

func TestProduct_Disable_whenPriceGreaterThanZero_shouldThrowError(t *testing.T) {
	product := app.Product{}
	product.Name = "Product 1"
	product.Status = app.ENABLED
	product.Price = 10

	err := product.Disable()
	require.Equal(t, "the price must be zero in order to have the product disabled", err.Error())
}

func TestProduct_IsValid_shouldSuccess(t *testing.T) {
	product := app.Product{}
	product.ID = uuid.NewV4().String()
	product.Name = "product1"
	product.Status = app.ENABLED
	product.Price = 10

	_, err := product.IsValid()
	require.Nil(t, err)
}

func TestProduct_IsValid_whenStatusIsWrong_shouldThrowError(t *testing.T) {
	product := app.Product{}
	product.ID = uuid.NewV4().String()
	product.Status = "INVALID"
	product.Price = 10

	_, err := product.IsValid()
	require.Equal(t, "the status must be enabled or disabled", err.Error())
}

func TestProduct_IsValid_whenPriceIsNegative_shouldThrowError(t *testing.T) {
	product := app.Product{}
	product.ID = uuid.NewV4().String()
	product.Status = app.ENABLED
	product.Price = -10

	_, err := product.IsValid()
	require.Equal(t, "the price must be greater or equal zero", err.Error())
}
