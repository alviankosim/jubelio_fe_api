--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

-- Started on 2022-06-06 15:57:50 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16397)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    sku character varying(50) NOT NULL,
    price numeric(10,0) NOT NULL,
    description text,
    product_no bigint,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE products; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.products IS 'table untuk menampung produk elevenia API';


--
-- TOC entry 209 (class 1259 OID 16396)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 209
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 212 (class 1259 OID 16409)
-- Name: products_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_images (
    id integer NOT NULL,
    product_id integer,
    image character varying(150)
);


ALTER TABLE public.products_images OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16408)
-- Name: products_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_images_id_seq OWNER TO postgres;

--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 211
-- Name: products_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_images_id_seq OWNED BY public.products_images.id;


--
-- TOC entry 3437 (class 2604 OID 16400)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3439 (class 2604 OID 16412)
-- Name: products_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_images ALTER COLUMN id SET DEFAULT nextval('public.products_images_id_seq'::regclass);


--
-- TOC entry 3445 (class 2606 OID 16414)
-- Name: products_images products_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3441 (class 2606 OID 16404)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3443 (class 2606 OID 16406)
-- Name: products unique_sku; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT unique_sku UNIQUE (sku);


-- Completed on 2022-06-06 15:57:51 WIB

--
-- PostgreSQL database dump complete
--

