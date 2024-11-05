import "../styles/SearchBar.css" 
import { IoIosSearch } from "react-icons/io";
import { SubmitHandler, useForm } from "react-hook-form" ; 
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";


type FormInput = {
    q: string
}

export default function SearchBar() {

	const [searchParams, setSearchParams] = useSearchParams() ;
	
	const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({
		defaultValues: {
			q: searchParams.get("q") || undefined 
		}
	}) ; 

	const location = useLocation() ;
	const navigate = useNavigate() ; 
	
    
    const onSubmit: SubmitHandler<FormInput> = (data) => {
		const query = data.q ; 
		if (location.pathname === "/search") {
			navigate(`/search?q=${encodeURI(query)}`) ; 
		} else if (location.pathname === "/") {
			navigate(`./search?q=${encodeURI(query)}`) ; 
		}
    }


	return (
		<>
			<form className="search-form" onSubmit={handleSubmit(onSubmit)}>
				<IoIosSearch
					className="search-form-search-icon" 
					size="25px" 
					onClick={handleSubmit(onSubmit)}
				/>
					<input
						id="search-input"
						type="text"
						placeholder="Search for music"
						{...register('q')}
					/>
			</form>
		</>
	) ; 
}