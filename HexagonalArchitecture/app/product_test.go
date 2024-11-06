package app_test

import (
	"testing"

	"github.com/juliotinti/go-hexagonal/app"
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
